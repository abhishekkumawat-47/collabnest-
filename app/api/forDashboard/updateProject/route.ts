import { NextRequest, NextResponse } from "next/server";

import {updateUserProjects} from '@/controllers/ForDashboard'

export async function PUT(
  request: NextRequest
) {
  try {
    
     

    
    return await updateUserProjects(request);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}