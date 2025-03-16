import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { projectId, ratings } = await request.json();
    
    // Log for debugging
    console.log('Received project ID:', projectId);
    console.log('Ratings:', ratings);

    // Use a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update project status
      const updatedProject = await tx.project.update({
        where: { id: projectId },
        data: { status: 'CLOSED' },
      });

      // Save ratings for each contributor
      for (const [userId, rating] of Object.entries(ratings)) {
        const validRating = Math.min(Number(rating), 10); // Ensure the rating does not exceed 10
        console.log(`Adding rating for user ${userId}: ${validRating}`);
        await tx.user.update({
          where: { id: userId },
          data: {
            rating: {
              increment: validRating,
            },
          },
        });
      }

      return updatedProject;
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error('Error ending project:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Failed to end project',
      message: errorMessage,
    }, { status: 500 });
  }
}