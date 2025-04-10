"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import {
  FiPlus,
  FiEdit,
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiChevronRight,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function CourseDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      fetchCourse();
    }
  }, [status, router, params.id]);

  const fetchCourse = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/courses/${params.id}`);
      setCourse(response.data.course);
    } catch (err) {
      console.error("Error fetching course:", err);
      setError("Failed to fetch course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FiLoader className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="mt-4 text-xl text-gray-600">Loading course...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !course) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <FiAlertCircle className="mr-2" />
            {error || "Course not found"}
          </div>
          <div className="mt-4">
            <Link href="/dashboard">
              <Button variant="outline" leftIcon={<FiArrowLeft />}>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const difficultyColors = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-yellow-100 text-yellow-800",
    advanced: "bg-red-100 text-red-800",
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="mr-4">
            <Button variant="ghost" leftIcon={<FiArrowLeft />}>
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  {course.title}
                </h1>
                <span
                  className={`ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    difficultyColors[
                      course.difficulty as keyof typeof difficultyColors
                    ]
                  }`}
                >
                  {course.difficulty.charAt(0).toUpperCase() +
                    course.difficulty.slice(1)}
                </span>
              </div>
              <p className="mt-2 text-gray-600">{course.description}</p>

              {course.learningOutcomes &&
                course.learningOutcomes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700">
                      Learning Outcomes:
                    </h3>
                    <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                      {course.learningOutcomes.map(
                        (outcome: string, index: number) => (
                          <li key={index}>{outcome}</li>
                        )
                      )}
                    </ul>
                  </div>
                )}

              <div className="mt-4 text-sm text-gray-500">
                Estimated completion time: {course.estimatedTime} minutes
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
              <Link href={`/courses/${params.id}/edit`}>
                <Button variant="outline" leftIcon={<FiEdit />}>
                  Edit Course
                </Button>
              </Link>
              <Link href={`/courses/${params.id}/modules/new`}>
                <Button variant="primary" leftIcon={<FiPlus />}>
                  Add Module
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Modules</h2>

        {course.modules.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No modules yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your course by adding modules and lessons.
            </p>
            <Link href={`/courses/${params.id}/modules/new`}>
              <Button variant="primary" leftIcon={<FiPlus />}>
                Add Your First Module
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {course.modules.map((module: any) => (
              <Card key={module._id} hoverable>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{module.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      {module.lessons?.length || 0} lessons
                    </div>
                  </div>
                  <Link href={`/modules/${module._id}`}>
                    <Button variant="ghost" rightIcon={<FiChevronRight />}>
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
