import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
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

    const course = await Course.findById(body.courseId);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    if (course.creator.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the highest order in the course
    const highestOrderModule = await Module.findOne({
      course: body.courseId,
    }).sort({ order: -1 });

    const order = highestOrderModule ? highestOrderModule.order + 1 : 1;

    const module = new Module({
      title: body.title,
      description: body.description,
      course: body.courseId,
      order,
      prerequisites: body.prerequisites || [],
    });

    await module.save();

    // Update the course with the new module
    course.modules.push(module._id);
    await course.save();

    return NextResponse.json({ module }, { status: 201 });
  } catch (error) {
    console.error("Error creating module:", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
