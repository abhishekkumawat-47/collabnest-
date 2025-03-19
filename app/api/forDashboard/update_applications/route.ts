import { NextResponse, NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
   
      try {
        
        const {acceptedIds,rejectedIds} = await request.json()
      
          if (!acceptedIds && !rejectedIds) {
            return NextResponse.json({ error: "Application ID is required" }, { status: 400 });
          }
      
          

          const updatedAccept = await prisma.application.updateMany({
            where: { id :{in : acceptedIds} },
            data:{
                status:"ACCEPTED"
            }
            
            
        });
        const updatedReject = await prisma.application.updateMany({
  where: { id: { in: rejectedIds } },
  data: { status: "REJECTED" },
});
          
          return NextResponse.json({message:"done"},{ status: 200 });
        } catch (error) {
          console.error("Error fetching applications:", error);
          return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
}