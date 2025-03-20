// api/users/route.ts or api/users/index.ts

import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email,roll,department,degree,year } = body;

    // Validate inputs
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      // Email already exists, don't do anything
      return NextResponse.json(
        { message: 'User with this email already exists' },
        { status: 200 }
      );
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name:name,
        roll:roll,
        email:email,
        degree:degree, // This is required in your schema
        year:year,
        department:department
      }
    });

    return NextResponse.json(
      { message: 'User created successfully', user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}