import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./User";

export interface ICourse extends Document {
  title: string;
  description: string;
  creator: IUser["_id"];
  modules: mongoose.Types.ObjectId[];
  learningOutcomes: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User", required: true },
    modules: [{ type: Schema.Types.ObjectId, ref: "Module" }],
    learningOutcomes: [{ type: String }],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    estimatedTime: { type: Number, default: 0 }, // in minutes
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
