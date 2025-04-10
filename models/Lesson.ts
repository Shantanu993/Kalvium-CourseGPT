import mongoose, { Schema, Document } from "mongoose";

export interface ILesson extends Document {
  title: string;
  description: string;
  module: mongoose.Types.ObjectId;
  content: string;
  learningOutcomes: string[];
  keyTerms: { term: string; definition: string }[];
  activities: {
    title: string;
    description: string;
    type: "quiz" | "discussion" | "assignment" | "exercise";
    content: any;
  }[];
  order: number;
  estimatedTime: number;
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    module: { type: Schema.Types.ObjectId, ref: "Module", required: true },
    content: { type: String, required: true },
    learningOutcomes: [{ type: String }],
    keyTerms: [
      {
        term: { type: String, required: true },
        definition: { type: String, required: true },
      },
    ],
    activities: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        type: {
          type: String,
          enum: ["quiz", "discussion", "assignment", "exercise"],
          required: true,
        },
        content: { type: Schema.Types.Mixed },
      },
    ],
    order: { type: Number, required: true },
    estimatedTime: { type: Number, default: 30 }, // in minutes
  },
  { timestamps: true }
);

export default mongoose.models.Lesson ||
  mongoose.model<ILesson>("Lesson", LessonSchema);
