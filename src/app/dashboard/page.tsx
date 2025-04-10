"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { FiPlus, FiLoader, FiAlertCircle } from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import CourseCard from "@/components/courses/CourseCard";
import Button from "@/components/ui/Button";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }

    if (status === "authenticated") {
      fetchCourses();
    }
  }, [status, router]);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/courses");
      setCourses(response.data.courses);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Failed to fetch courses. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`/api/courses/${id}`);
        setCourses(courses.filter((course: any) => course._id !== id));
      } catch (err) {
        console.error("Error deleting course:", err);
        alert("Failed to delete course. Please try again.");
      }
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <FiLoader className="w-12 h-12 text-indigo-600 animate-spin" />
            <p className="mt-4 text-xl text-gray-600">
              Loading your courses...
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Courses</h1>
            <p className="mt-1 text-gray-600">
              Manage and create your educational content
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link href="/courses/new">
              <Button variant="primary" leftIcon={<FiPlus />}>
                Create New Course
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
              <FiBook className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-xl font-medium text-gray-900 mb-2">
              No courses yet
            </h2>
            <p className="text-gray-600 mb-6">
              Get started by creating your first course with AI assistance.
            </p>
            <Link href="/courses/new">
              <Button variant="primary" leftIcon={<FiPlus />}>
                Create Your First Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course: any) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.title}
                description={course.description}
                difficulty={course.difficulty}
                estimatedTime={course.estimatedTime}
                moduleCount={course.modules.length}
                onDelete={handleDeleteCourse}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
