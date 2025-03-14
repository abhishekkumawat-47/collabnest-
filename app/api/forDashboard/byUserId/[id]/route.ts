import { NextResponse, NextRequest } from 'next/server';
import { getUserProjectsById } from '@/controllers/ForDashboard.ts';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;

        if (!id) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Fetch user projects
        const response = await getUserProjectsById({ params: { id } });

        return response;
    } catch (error) {
        console.error('Error in GET handler:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
