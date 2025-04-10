"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { FiSave, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
import ModuleGenerator from "@/components/modules/ModuleGenerator";

const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  estimatedTime: z.number().min(0, "Estimated time cannot be negative"),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCourse() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [generatedModules, setGeneratedModules] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      difficulty: "intermediate",
      estimatedTime: 0,
    },
  });

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const onSubmit = async (data: CourseFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await axios.post("/api/courses", data);
      setCourseId(response.data.course._id);
    } catch (err) {
      console.error("Error creating course:", err);
      setError("Failed to create course. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModulesGenerated = async (modules: any[]) => {
    setGeneratedModules(modules);

    if (!courseId) return;

    try {
      // Create modules in the database
      for (const module of modules) {
        await axios.post("/api/modules", {
          title: module.title,
          description: module.description,
          courseId: courseId,
        });
      }

      // Redirect to the course page
      router.push(`/courses/${courseId}`);
    } catch (err) {
      console.error("Error creating modules:", err);
      setError("Failed to create modules. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" leftIcon={<FiArrowLeft />}>
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Course
          </h1>
        </div>

        {!courseId ? (
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Course Title"
                placeholder="Enter course title"
                fullWidth
                {...register("title")}
                error={errors.title?.message}
              />

              <Textarea
                label="Course Description"
                placeholder="Provide a detailed description of your course"
                fullWidth
                {...register("description")}
                error={errors.description?.message}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Difficulty Level"
                  options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                  ]}
                  fullWidth
                  {...register("difficulty")}
                  error={errors.difficulty?.message}
                />

                <Input
                  type="number"
                  label="Estimated Time (minutes)"
                  placeholder="Total estimated completion time"
                  fullWidth
                  {...register("estimatedTime", { valueAsNumber: true })}
                  error={errors.estimatedTime?.message}
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting}
                  leftIcon={<FiSave />}
                >
                  {isSubmitting ? "Creating Course..." : "Create Course"}
                </Button>
              </div>
            </form>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
              Course created successfully! Now let's generate some modules.
            </div>

            <ModuleGenerator
              courseId={courseId}
              onModulesGenerated={handleModulesGenerated}
            />

            {generatedModules.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  Generated Modules
                </h2>
                <div className="space-y-3">
                  {generatedModules.map((module, index) => (
                    <Card key={index}>
                      <h3 className="text-lg font-medium text-gray-900">
                        {module.title}
                      </h3>
                      <p className="mt-1 text-gray-600">{module.description}</p>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-700">
                          Lesson Topics:
                        </h4>
                        <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                          {module.lessonTopics.map(
                            (topic: string, i: number) => (
                              <li key={i}>{topic}</li>
                            )
                          )}
                        </ul>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="primary"
                    onClick={() => router.push(`/courses/${courseId}`)}
                  >
                    Continue to Course
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
