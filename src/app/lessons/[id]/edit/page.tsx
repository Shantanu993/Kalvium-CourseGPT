"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import { FiArrowLeft, FiLoader, FiAlertCircle } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import LessonEditor from "@/components/lessons/LessonEditor";

export default function EditLesson({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      fetchLesson();
    }
  }, [status, router, params.id]);

  const fetchLesson = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/lessons/${params.id}`);
      setLesson(response.data.lesson);
    } catch (err) {
      console.error("Error fetching lesson:", err);
      setError("Failed to fetch lesson. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonSaved = (updatedLesson: any) => {
    router.push(`/lessons/${params.id}`);
  };

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FiLoader className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="mt-4 text-xl text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !lesson) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md flex items-center">
            <FiAlertCircle className="mr-2" />
            {error || "Lesson not found"}
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
          <Link href={`/lessons/${params.id}`} className="mr-4">
            <Button variant="ghost" leftIcon={<FiArrowLeft />}>
              Back to Lesson
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit Lesson</h1>
        </div>

        <LessonEditor
          initialData={lesson}
          moduleId={lesson.module}
          onSave={handleLessonSaved}
        />
      </div>
    </MainLayout>
  );
}
