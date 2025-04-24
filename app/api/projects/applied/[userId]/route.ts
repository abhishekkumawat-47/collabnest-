import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Ensure this points to your Prisma client

export async function GET(req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  if (!userId) {
    return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
  }

  try {
    const appliedProjects = await prisma.application.findMany({
      where: {
        applicantId: userId,
        status: { in: ["PENDING", "REJECTED", "ACCEPTED"] },
      },
      select: {
        project: {
          select: {
            id: true,
            title: true,
            description: true,
            requirementTags: true,
            deadlineToApply: true,
            status: true,
          },
        },
      },
    });

    // Flatten the response to extract projects directly
    const formattedProjects = appliedProjects.map((app) => ({
      id: app.project.id,
      title: app.project.title,
      description: app.project.description,
      requirementTags: app.project.requirementTags,
      deadlineToApply: app.project.deadlineToApply,
      status: app.project.status,
    }));

    return NextResponse.json(formattedProjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching applied projects:", error);
    return NextResponse.json({ error: "Failed to fetch applied projects" }, { status: 500 });
  }
}
