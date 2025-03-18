import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Console } from "console";

export async function POST(req: NextRequest) {
  try {
    const {
      title,
      subheading,
      description,
      tags,
      difficulty,
      deadlineToApply,
      deadlineToComplete,
      applicantCapacity,
      authorId,
      author,
    } = await req.json();

    // Validate required fields
    if (
      !title ||
      !subheading ||
      !description ||
      !tags ||
      !difficulty ||
      !deadlineToApply ||
      !deadlineToComplete ||
      !applicantCapacity ||
      !authorId ||
      !author
    ) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    console.log(title,
      subheading,
      description,
      tags,
      difficulty,
      deadlineToApply,
      deadlineToComplete,
      applicantCapacity,
      
      author,)

    // Validate dates
    const applyDate = new Date(deadlineToApply);
    const completeDate = new Date(deadlineToComplete);
    if (isNaN(applyDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid deadlineToApply date" },
        { status: 400 }
      );
    }
    if (isNaN(completeDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid deadlineToComplete date" },
        { status: 400 }
      );
    }

    // Create the project
    const newProject = await prisma.project.create({
      data: {
        title,
        subheading,
        description,
        requirementTags: tags,
        difficultyTag: difficulty,
        deadlineToApply: applyDate.toISOString(),
        deadlineToComplete: completeDate.toISOString(),
        applicantCapacity,
        
        author,
      },
    });

    // Return the created project
    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}