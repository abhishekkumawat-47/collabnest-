import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

function getNewRating(oldRating: number, score: number, toughness: number): number {
  let p = 2000;
  if (toughness === 1) {
    p = 800;
  } else if (toughness === 2) {
    p = 1400;
  }

  const a = 2 * score - 1;
  const b = 1.0 / (1.0 + Math.pow(10, (p - oldRating) / 400.0));

  let k = 10;
  if (oldRating < 1200) {
    k = a - b >= 0 ? 40 : 20;
  } else if (oldRating < 1800) {
    k = 20;
  }

  let r = a - b > 0 && oldRating - p > 200 ? 0.5 : 1;
  return (a - b) * 3.0 * k * r + oldRating;
}

export async function POST(request: NextRequest) {
  try {
    const { projectId, ratings } = await request.json();

    console.log('Received project ID:', projectId);
    console.log('Ratings:', ratings);

    const result = await prisma.$transaction(async (tx) => {
      // Update project status
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: { status: 'CLOSED' },
      });

      // Fetch difficultyTag properly
      const project = await tx.project.findUnique({
        where: { id: projectId },
        select: { difficultyTag: true },
      });

      if (!project) {
        throw new Error(`Project with ID ${projectId} not found.`);
      }

      // Map difficultyTag enum to numeric toughness
      const difficultyMapping: Record<string, number> = {
        BEGINNER: 1,
        INTERMEDIATE: 2,
        ADVANCED: 3,
      };

      const toughness = difficultyMapping[project.difficultyTag] ?? 2; // Default to INTERMEDIATE

      // Update user ratings
      for (const [userId, score] of Object.entries(ratings)) {
        const validScore = Math.min(Number(score), 10);

        // Fetch current user rating
        const user = await tx.user.findUnique({
          where: { id: userId },
          select: { rating: true },
        });

        if (!user) {
          console.warn(`User ${userId} not found, skipping rating update.`);
          continue;
        }

        // Calculate new rating
        const newRating = getNewRating(user.rating, validScore, toughness);

        console.log(`Updating rating for user ${userId}: Old=${user.rating}, New=${newRating}`);

        // Update user's rating
        await tx.user.update({
          where: { id: userId },
          data: { rating: newRating },
        });
      }

      return updatedProject;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error ending project:', error);
    return NextResponse.json(
      {
        error: 'Failed to end project',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}