import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // Fetch Project Members directly from the database
    const projectMembers = await prisma.projectMember.findMany({
      where: { projectId: id },
      include: {
        user: true,
        project: true,
      },
    });


    return NextResponse.json(projectMembers, { status: 200 }); 

  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    // remove user from project members

    const body = await request.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    
    // Check if user and project exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const project = await prisma.project.findUnique({ where: { id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // search user in project members
    const projectMember = await prisma.projectMember.findFirst({
      where: { userId, projectId: id },
    });

    if (!projectMember) {
      return NextResponse.json({ error: "User is not a project member" }, { status: 404 });
    }
    // Remove user from project members     
    await prisma.projectMember.delete({
      where: { id: projectMember.id },
    });
    
    return NextResponse.json({ message: "User removed from project members" }, { status: 200 });
    
  } catch (error) {
    console.error("Error adding project member:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

