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
