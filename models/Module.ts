import mongoose, { Schema, Document } from "mongoose";

export interface IModule extends Document {
  title: string;
  description: string;
  course: mongoose.Types.ObjectId;
  lessons: mongoose.Types.ObjectId[];
  order: number;
  prerequisites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ModuleSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
    order: { type: Number, required: true },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: "Module" }],
  },
  { timestamps: true }
);

export default mongoose.models.Module ||
  mongoose.model<IModule>("Module", ModuleSchema);
