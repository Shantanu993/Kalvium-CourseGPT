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

export default function ModuleDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [module, setModule] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      fetchModule();
    }
  }, [status, router, params.id]);

  const fetchModule = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/modules/${params.id}`);
      setModule(response.data.module);
    } catch (err) {
      console.error("Error fetching module:", err);
      setError("Failed to fetch module. Please try again.");
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
            <p className="mt-4 text-xl text-gray-600">Loading module...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !module) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <FiAlertCircle className="mr-2" />
            {error || "Module not found"}
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

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-6">
          <Link href={`/courses/${module.course}`} className="mr-4">
            <Button variant="ghost" leftIcon={<FiArrowLeft />}>
              Back to Course
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {module.title}
              </h1>
              <p className="mt-2 text-gray-600">{module.description}</p>

              {module.prerequisites && module.prerequisites.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700">
                    Prerequisites:
                  </h3>
                  <ul className="mt-1 list-disc pl-5 text-sm text-gray-600">
                    {module.prerequisites.map((prereq: any) => (
                      <li key={prereq._id}>{prereq.title}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 md:mt-0 flex flex-col space-y-2">
              <Link href={`/modules/${params.id}/edit`}>
                <Button variant="outline" leftIcon={<FiEdit />}>
                  Edit Module
                </Button>
              </Link>
              <Link href={`/modules/${params.id}/lessons/new`}>
                <Button variant="primary" leftIcon={<FiPlus />}>
                  Add Lesson
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4">Lessons</h2>

        {module.lessons.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No lessons yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start building your module by adding lessons with AI assistance.
            </p>
            <Link href={`/modules/${params.id}/lessons/new`}>
              <Button variant="primary" leftIcon={<FiPlus />}>
                Add Your First Lesson
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {module.lessons.map((lesson: any) => (
              <Card key={lesson._id} hoverable>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {lesson.title}
                    </h3>
                    <p className="mt-1 text-gray-600">{lesson.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      Estimated time: {lesson.estimatedTime} minutes
                    </div>
                  </div>
                  <Link href={`/lessons/${lesson._id}`}>
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
