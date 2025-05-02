import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Fetch only "PENDING" applications directly from the database
    const applications = await prisma.application.findMany({
      where: { projectId: id, status: "PENDING" },  // ✅ Filter at the DB level
      include: {
        applicant: true,
        project: true,
      },
    });

    return NextResponse.json(applications, { status: 200 }); // ✅ Return array directly
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
