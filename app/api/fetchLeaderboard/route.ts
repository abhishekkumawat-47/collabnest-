import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    console.log('Connecting to database...');
    const topUsers = await prisma.user.findMany({
      where: { role: 'USER' }, // Filter users with role USER
      orderBy: { rating: 'desc' }, // Sort by rating (highest first)
      take: 10, // Get top 10 users
      select: {
        id: true,
        username: true,
        name: true,
        department: true,
        rating: true,
        picture: true,
      },
    });
    
    return NextResponse.json(topUsers, { status: 200 });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}