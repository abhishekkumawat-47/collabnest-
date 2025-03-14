import { NextRequest, NextResponse } from "next/server";

import { updateProjectResources} from "@/controllers/ForDashboard";



export async function POST(req: NextRequest) {
  try {
    
     

    
    return await updateProjectResources(req);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}