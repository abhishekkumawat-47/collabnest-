import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch project details by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const projectId = params.id; // Use ID as string
    if (!projectId) {
      return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        author: true, // Include author details if needed
        subtasks: true, // Include subtasks
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
