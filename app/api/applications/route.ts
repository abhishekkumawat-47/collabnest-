import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");

  try {
    const applications = await prisma.application.findMany({
      where: { projectId: projectId ?? undefined },
      include: { applicant: true }, // Include user details
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


// Define request body type
interface RequestBody {
  action: "apply" | "withdraw"|"accept"|"reject";
  applicantId: string;
  projectId: string;
}

// Define response type
interface ApiResponse {
  message?: string;
  error?: string;
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body: RequestBody = await req.json();

    if (!body.action) {
      return NextResponse.json({ error: "Action is required" }, { status: 400 });
    }

    if (body.action === "apply") {
      return await applyToProject(body.applicantId, body.projectId);
    }

    if (body.action === "withdraw") {
      return await withdrawFromProject(body.applicantId, body.projectId);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// Function to apply for a project
async function applyToProject(applicantId: string, projectId: string): Promise<NextResponse<ApiResponse>> {
  if (!applicantId || !projectId) {
    return NextResponse.json({ error: "User ID and Project ID are required" }, { status: 400 });
  }

  // Check if user and project exist
  const user = await prisma.user.findUnique({ where: { id: applicantId } });
  const project = await prisma.project.findUnique({ where: { id: projectId } });

  if (!user || !project) {
    return NextResponse.json({ error: "User or Project not found" }, { status: 404 });
  }

  // Create a new application entry
  await prisma.application.create({
    data: {
      applicantId: applicantId,
      projectId: projectId,
    },
  });

  return NextResponse.json({ message: "Applied to project successfully!" }, { status: 200 });
}

// Function to withdraw from a project
async function withdrawFromProject(applicantId: string, projectId: string): Promise<NextResponse<ApiResponse>> {
  if (!applicantId || !projectId) {
    return NextResponse.json({ error: "User ID and Project ID are required" }, { status: 400 });
  }

  // Delete the application entry
  const application = await prisma.application.findFirst({
    where: {
      applicantId: applicantId,
      projectId: projectId,
    },
  });

  if (!application) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  // Delete the found application
  await prisma.application.delete({ where: { id: application.id } });

  return NextResponse.json({ message: "Withdrawn from project successfully!" }, { status: 200 });
}


