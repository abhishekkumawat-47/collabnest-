import { NextResponse, NextRequest } from 'next/server';
import { getUserProjectsById } from '@/controllers/ForDashboard.ts';
import { getUserById } from '@/controllers/userController';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
     const { id } = await params;
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return NextResponse.json({ error: 'User not found' },{status:404});
        return NextResponse.json(user);
    } catch (error) {
        NextResponse.json({ error: 'Server error' },{status:500});
    }
}
