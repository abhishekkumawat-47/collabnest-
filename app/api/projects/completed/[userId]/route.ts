import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this points to your Prisma client

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const completedProjects = await prisma.project.findMany({
      where: {
        OR: [
          { authorId: userId }, // Projects created by the user
          { members: { some: { userId } } }, // Projects where the user is a participant
        ],
        status: "CLOSED", // Completed projects only
      },
      select: {
        id: true,
        title: true,
        description: true,
        requirementTags: true,
        deadlineToComplete: true,
      },
    });

    return NextResponse.json(completedProjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching completed projects:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}
