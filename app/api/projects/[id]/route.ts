import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// GET: Fetch project details by ID
export async function GET(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  console.log("Project ID:", id);

  if (!id) {
    return NextResponse.json({ error: "Invalid project ID" }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      author: true,
      subtasks: true,
      applications: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  return NextResponse.json(project, { status: 200 });
}
