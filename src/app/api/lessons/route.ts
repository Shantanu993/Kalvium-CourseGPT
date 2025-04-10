import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Lesson from "@/models/Lesson";
import Module from "@/models/Module";
import Course from "@/models/Course";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const user = await User.findOne({ email: session.user?.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();

    const module = await Module.findById(body.moduleId);

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const course = await Course.findById(module.course);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the highest order in the module
    const highestOrderLesson = await Lesson.findOne({
      module: body.moduleId,
    }).sort({ order: -1 });

    const order = highestOrderLesson ? highestOrderLesson.order + 1 : 1;

    const lesson = new Lesson({
      title: body.title,
      description: body.description,
      module: body.moduleId,
      content: body.content,
      learningOutcomes: body.learningOutcomes || [],
      keyTerms: body.keyTerms || [],
      activities: body.activities || [],
      order,
      estimatedTime: body.estimatedTime || 30,
    });

    await lesson.save();

    // Update the module with the new lesson
    module.lessons.push(lesson._id);
    await module.save();

    return NextResponse.json({ lesson }, { status: 201 });
  } catch (error) {
    console.error("Error creating lesson:", error);
    return NextResponse.json(
      { error: "Failed to create lesson" },
      { status: 500 }
    );
  }
}
