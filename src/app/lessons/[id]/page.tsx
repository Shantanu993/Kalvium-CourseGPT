"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import axios from "axios";
import {
  FiEdit,
  FiArrowLeft,
  FiLoader,
  FiAlertCircle,
  FiClock,
} from "react-icons/fi";
import MainLayout from "@/components/layout/MainLayout";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ReactMarkdown from "react-markdown";

export default function LessonDetails({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lesson, setLesson] = useState<any>(null);
  const [module, setModule] = useState<any>(null);
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

      // Fetch the module to get navigation context
      const moduleResponse = await axios.get(
        `/api/modules/${response.data.lesson.module}`
      );
      setModule(moduleResponse.data.module);
    } catch (err) {
      console.error("Error fetching lesson:", err);
      setError("Failed to fetch lesson. Please try again.");
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
            <p className="mt-4 text-xl text-gray-600">Loading lesson...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !lesson || !module) {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center mb-6">
          <Link href={`/modules/${module._id}`} className="mr-4">
            <Button variant="ghost" leftIcon={<FiArrowLeft />}>
              Back to Module
            </Button>
          </Link>
          <div className="flex-grow"></div>
          <Link href={`/lessons/${params.id}/edit`}>
            <Button variant="outline" leftIcon={<FiEdit />}>
              Edit Lesson
            </Button>
          </Link>
        </div>

        <article className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-3xl font-bold text-gray-900">{lesson.title}</h1>
            <p className="mt-2 text-gray-600">{lesson.description}</p>

            <div className="mt-4 flex items-center text-sm text-gray-500">
              <FiClock className="mr-1" />
              <span>Estimated time: {lesson.estimatedTime} minutes</span>
            </div>
          </div>

          {lesson.learningOutcomes && lesson.learningOutcomes.length > 0 && (
            <div className="p-6 bg-indigo-50 border-b border-indigo-100">
              <h2 className="text-lg font-semibold text-indigo-900 mb-2">
                Learning Outcomes
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-indigo-800">
                {lesson.learningOutcomes.map(
                  (outcome: string, index: number) => (
                    <li key={index}>{outcome}</li>
                  )
                )}
              </ul>
            </div>
          )}

          <div className="p-6 prose max-w-none">
            <ReactMarkdown>{lesson.content}</ReactMarkdown>
          </div>

          {lesson.keyTerms && lesson.keyTerms.length > 0 && (
            <div className="p-6 bg-gray-50 border-t border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Key Terms
              </h2>
              <dl className="space-y-3">
                {lesson.keyTerms.map((term: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-3 rounded-md shadow-sm"
                  >
                    <dt className="font-medium text-gray-900">{term.term}</dt>
                    <dd className="mt-1 text-gray-600">{term.definition}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {lesson.activities && lesson.activities.length > 0 && (
            <div className="p-6 bg-blue-50 border-t border-blue-100">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">
                Activities
              </h2>
              <div className="space-y-4">
                {lesson.activities.map((activity: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-md shadow-sm border border-blue-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-blue-800">
                        {activity.title}
                      </h3>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                        {activity.type.charAt(0).toUpperCase() +
                          activity.type.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-600">{activity.description}</p>
                    {activity.content &&
                      Object.keys(activity.content).length > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-100">
                          {/* Render different activity content based on type */}
                          {activity.type === "quiz" &&
                            activity.content.questions && (
                              <div className="space-y-3">
                                {activity.content.questions.map(
                                  (q: any, qIndex: number) => (
                                    <div
                                      key={qIndex}
                                      className="bg-blue-50 p-3 rounded-md"
                                    >
                                      <p className="font-medium text-blue-800 mb-2">
                                        {q.question}
                                      </p>
                                      <div className="space-y-1">
                                        {q.options.map(
                                          (option: string, oIndex: number) => (
                                            <div
                                              key={oIndex}
                                              className="flex items-center"
                                            >
                                              <input
                                                type="radio"
                                                id={`q${qIndex}-o${oIndex}`}
                                                name={`question-${qIndex}`}
                                                className="mr-2"
                                              />
                                              <label
                                                htmlFor={`q${qIndex}-o${oIndex}`}
                                              >
                                                {option}
                                              </label>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            )}

                          {activity.type === "discussion" &&
                            activity.content.prompts && (
                              <div className="space-y-2">
                                {activity.content.prompts.map(
                                  (prompt: string, pIndex: number) => (
                                    <div
                                      key={pIndex}
                                      className="bg-blue-50 p-3 rounded-md"
                                    >
                                      <p className="text-blue-800">{prompt}</p>
                                    </div>
                                  )
                                )}
                              </div>
                            )}
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </MainLayout>
  );
}
