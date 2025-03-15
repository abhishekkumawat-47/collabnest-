import { NextRequest, NextResponse } from "next/server";

import { updateSubtasks } from "@/controllers/ForDashboard";


export async function POST(request: NextRequest) {
    return updateSubtasks(request)
}

