import { NextResponse, NextRequest } from 'next/server';
import { getUserProjectsById } from '@/controllers/ForDashboard.ts';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
   const { id } = params;
       try {
           const user = await prisma.user.findUnique({
               where: { id },
               include: {
                   projectCreated:{
                    include:{
                        applications:true,
                        author:true,
                        members:{
                            include:{
                                user:true,
                            }
                        },
                        subtasks:true 
                    }
                   }
           }});
   
           if (!user) {
               return NextResponse.json({ error: 'User not found' }, { status: 404 });
           }
   
           // Filter user's projects where they are a participant
           const userProjects = user.projectCreated
               .filter((mem) => mem.authorId === id);
               
   
           return NextResponse.json(userProjects);
       } catch (error) {
           console.error('Error in getUserProjectsById:', error);
           return NextResponse.json({ error: 'Server error' }, { status: 500 });
       }
}