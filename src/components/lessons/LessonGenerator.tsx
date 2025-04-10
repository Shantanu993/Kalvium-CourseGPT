import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { FiLoader, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Select from "../ui/Select";
import Card from "../ui/Card";

const lessonGenerationSchema = z.object({
  topic: z.string().min(3, "Topic must be at least 3 characters"),
  targetAudience: z
    .string()
    .min(3, "Target audience must be at least 3 characters"),
  learningLevel: z.enum(["beginner", "intermediate", "advanced"]),
  desiredOutcomes: z
    .string()
    .min(10, "Desired outcomes must be at least 10 characters"),
  additionalContext: z.string().optional(),
});

type LessonGenerationFormData = z.infer<typeof lessonGenerationSchema>;

interface LessonGeneratorProps {
  moduleId?: string;
  onLessonGenerated: (lessonData: any) => void;
}

const LessonGenerator: React.FC<LessonGeneratorProps> = ({
  moduleId,
  onLessonGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LessonGenerationFormData>({
    resolver: zodResolver(lessonGenerationSchema),
    defaultValues: {
      learningLevel: "intermediate",
    },
  });

  const onSubmit = async (data: LessonGenerationFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post("/api/lessons/generate", data);
      onLessonGenerated(response.data.lesson);
    } catch (err) {
      console.error("Error generating lesson:", err);
      setError("Failed to generate lesson. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card title="Generate Lesson Content">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Topic"
          placeholder="Enter the main topic of the lesson"
          fullWidth
          {...register("topic")}
          error={errors.topic?.message}
        />

        <Input
          label="Target Audience"
          placeholder="Who is this lesson for? (e.g., High school students, College freshmen)"
          fullWidth
          {...register("targetAudience")}
          error={errors.targetAudience?.message}
        />

        <Select
          label="Learning Level"
          options={[
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" },
          ]}
          fullWidth
          {...register("learningLevel")}
          error={errors.learningLevel?.message}
        />

        <Textarea
          label="Desired Learning Outcomes"
          placeholder="What should learners be able to do after completing this lesson?"
          fullWidth
          {...register("desiredOutcomes")}
          error={errors.desiredOutcomes?.message}
        />

        <Textarea
          label="Additional Context (Optional)"
          placeholder="Any additional information that might help generate better content"
          fullWidth
          {...register("additionalContext")}
          error={errors.additionalContext?.message}
        />

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          fullWidth
          isLoading={isGenerating}
          leftIcon={isGenerating ? undefined : <FiCheckCircle />}
        >
          {isGenerating ? "Generating Lesson..." : "Generate Lesson"}
        </Button>
      </form>
    </Card>
  );
};

export default LessonGenerator;
