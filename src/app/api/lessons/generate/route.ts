import { NextRequest, NextResponse } from "next/server";
import { generateLesson, LessonGenerationParams } from "@/services/ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const params: LessonGenerationParams = {
      topic: body.topic,
      targetAudience: body.targetAudience,
      learningLevel: body.learningLevel,
      desiredOutcomes: body.desiredOutcomes,
      additionalContext: body.additionalContext,
    };

    const lessonContent = await generateLesson(params);

    return NextResponse.json({ lesson: lessonContent });
  } catch (error) {
    console.error("Error generating lesson:", error);
    return NextResponse.json(
      { error: "Failed to generate lesson" },
      { status: 500 }
    );
  }
}
