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

const moduleGenerationSchema = z.object({
  courseTitle: z.string().min(3, "Course title must be at least 3 characters"),
  courseDescription: z
    .string()
    .min(10, "Course description must be at least 10 characters"),
  numberOfModules: z
    .number()
    .min(1, "At least 1 module is required")
    .max(10, "Maximum 10 modules allowed"),
  targetAudience: z
    .string()
    .min(3, "Target audience must be at least 3 characters"),
  learningLevel: z.enum(["beginner", "intermediate", "advanced"]),
});

type ModuleGenerationFormData = z.infer<typeof moduleGenerationSchema>;

interface ModuleGeneratorProps {
  courseId?: string;
  onModulesGenerated: (moduleData: any[]) => void;
}

const ModuleGenerator: React.FC<ModuleGeneratorProps> = ({
  courseId,
  onModulesGenerated,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ModuleGenerationFormData>({
    resolver: zodResolver(moduleGenerationSchema),
    defaultValues: {
      numberOfModules: 5,
      learningLevel: "intermediate",
    },
  });

  const onSubmit = async (data: ModuleGenerationFormData) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await axios.post("/api/modules/generate", data);
      onModulesGenerated(response.data.modules);
    } catch (err) {
      console.error("Error generating modules:", err);
      setError("Failed to generate modules. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card title="Generate Module Structure">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Course Title"
          placeholder="Enter the title of your course"
          fullWidth
          {...register("courseTitle")}
          error={errors.courseTitle?.message}
        />

        <Textarea
          label="Course Description"
          placeholder="Provide a detailed description of your course"
          fullWidth
          {...register("courseDescription")}
          error={errors.courseDescription?.message}
        />

        <Input
          type="number"
          label="Number of Modules"
          placeholder="How many modules should the course have?"
          fullWidth
          {...register("numberOfModules", { valueAsNumber: true })}
          error={errors.numberOfModules?.message}
        />

        <Input
          label="Target Audience"
          placeholder="Who is this course for? (e.g., High school students, College freshmen)"
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
          {isGenerating ? "Generating Modules..." : "Generate Module Structure"}
        </Button>
      </form>
    </Card>
  );
};

export default ModuleGenerator;
