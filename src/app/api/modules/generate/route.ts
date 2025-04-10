import { NextRequest, NextResponse } from "next/server";
import { generateModuleStructure, ModuleGenerationParams } from "@/services/ai";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const params: ModuleGenerationParams = {
      courseTitle: body.courseTitle,
      courseTitle: body.courseTitle,
      courseDescription: body.courseDescription,
      numberOfModules: body.numberOfModules,
      targetAudience: body.targetAudience,
      learningLevel: body.learningLevel,
    };

    const moduleStructure = await generateModuleStructure(params);

    return NextResponse.json({ modules: moduleStructure });
  } catch (error) {
    console.error("Error generating module structure:", error);
    return NextResponse.json(
      { error: "Failed to generate module structure" },
      { status: 500 }
    );
  }
}
