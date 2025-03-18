import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
const prisma = new PrismaClient();

//function to fetch alll projects

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        applications: true, 
      },
    });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

