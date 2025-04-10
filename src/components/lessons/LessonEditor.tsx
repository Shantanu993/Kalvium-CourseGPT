import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { FiSave, FiRefreshCw, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Card from "../ui/Card";
import ReactMarkdown from "react-markdown";

const lessonSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  learningOutcomes: z
    .array(z.string())
    .min(1, "At least one learning outcome is required"),
  keyTerms: z.array(
    z.object({
      term: z.string().min(1, "Term is required"),
      definition: z.string().min(1, "Definition is required"),
    })
  ),
  activities: z.array(
    z.object({
      title: z.string().min(1, "Activity title is required"),
      description: z.string().min(1, "Activity description is required"),
      type: z.enum(["quiz", "discussion", "assignment", "exercise"]),
      content: z.any(),
    })
  ),
  estimatedTime: z.number().min(1, "Estimated time must be at least 1 minute"),
});

type LessonFormData = z.infer<typeof lessonSchema>;

interface LessonEditorProps {
  initialData?: any;
  moduleId: string;
  onSave: (lessonData: any) => void;
}

const LessonEditor: React.FC<LessonEditorProps> = ({
  initialData,
  moduleId,
  onSave,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = useForm<LessonFormData>({
    resolver: zodResolver(lessonSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      content: "",
      learningOutcomes: [""],
      keyTerms: [{ term: "", definition: "" }],
      activities: [
        {
          title: "",
          description: "",
          type: "quiz",
          content: {},
        },
      ],
      estimatedTime: 30,
    },
  });

  const content = watch("content");

  const onSubmit = async (data: LessonFormData) => {
    setIsSaving(true);
    setError(null);

    try {
      let response;

      if (initialData?._id) {
        response = await axios.put(`/api/lessons/${initialData._id}`, {
          ...data,
          module: moduleId,
        });
      } else {
        response = await axios.post("/api/lessons", {
          ...data,
          moduleId,
        });
      }

      onSave(response.data.lesson);
    } catch (err) {
      console.error("Error saving lesson:", err);
      setError("Failed to save lesson. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const regenerateSection = async (section: string) => {
    // Implementation for regenerating specific sections
    // This would call the AI service to regenerate just a part of the lesson
  };

  // Dynamic fields for learning outcomes
  const learningOutcomes = watch("learningOutcomes");

  const addLearningOutcome = () => {
    setValue("learningOutcomes", [...learningOutcomes, ""]);
  };

  const removeLearningOutcome = (index: number) => {
    setValue(
      "learningOutcomes",
      learningOutcomes.filter((_, i) => i !== index)
    );
  };

  // Dynamic fields for key terms
  const keyTerms = watch("keyTerms");

  const addKeyTerm = () => {
    setValue("keyTerms", [...keyTerms, { term: "", definition: "" }]);
  };

  const removeKeyTerm = (index: number) => {
    setValue(
      "keyTerms",
      keyTerms.filter((_, i) => i !== index)
    );
  };

  // Dynamic fields for activities
  const activities = watch("activities");

  const addActivity = () => {
    setValue("activities", [
      ...activities,
      {
        title: "",
        description: "",
        type: "quiz",
        content: {},
      },
    ]);
  };

  const removeActivity = (index: number) => {
    setValue(
      "activities",
      activities.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {initialData?._id ? "Edit Lesson" : "Create New Lesson"}
        </h2>
        <div className="flex space-x-2">
          <Button
            type="button"
            variant={previewMode ? "primary" : "outline"}
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
        </div>
      </div>

      {previewMode ? (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h1 className="text-3xl font-bold mb-2">{watch("title")}</h1>
          <p className="text-gray-600 mb-6">{watch("description")}</p>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Learning Outcomes</h2>
            <ul className="list-disc pl-5 space-y-1">
              {watch("learningOutcomes").map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>

          <div className="prose max-w-none mb-8">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          {watch("keyTerms").length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Key Terms</h2>
              <dl className="space-y-2">
                {watch("keyTerms").map((term, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-md">
                    <dt className="font-medium">{term.term}</dt>
                    <dd className="mt-1 text-gray-600">{term.definition}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {watch("activities").length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Activities</h2>
              <div className="space-y-4">
                {watch("activities").map((activity, index) => (
                  <div
                    key={index}
                    className="bg-indigo-50 p-4 rounded-md border border-indigo-100"
                  >
                    <h3 className="font-medium text-indigo-800">
                      {activity.title}
                    </h3>
                    <p className="text-indigo-600 mt-1">
                      {activity.description}
                    </p>
                    <div className="mt-2 text-sm text-indigo-500">
                      Type:{" "}
                      {activity.type.charAt(0).toUpperCase() +
                        activity.type.slice(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-gray-500 text-sm">
            Estimated completion time: {watch("estimatedTime")} minutes
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Input
                label="Title"
                placeholder="Enter lesson title"
                fullWidth
                {...register("title")}
                error={errors.title?.message}
              />

              <Textarea
                label="Description"
                placeholder="Brief overview of the lesson"
                fullWidth
                {...register("description")}
                error={errors.description?.message}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Learning Outcomes
                </label>
                <div className="space-y-2">
                  {learningOutcomes.map((_, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        placeholder={`Learning outcome ${index + 1}`}
                        fullWidth
                        {...register(`learningOutcomes.${index}`)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeLearningOutcome(index)}
                        disabled={learningOutcomes.length <= 1}
                      >
                        <FiTrash2 />
                      </Button>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  leftIcon={<FiPlus />}
                  onClick={addLearningOutcome}
                >
                  Add Outcome
                </Button>
                {errors.learningOutcomes && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.learningOutcomes.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    leftIcon={<FiRefreshCw />}
                    onClick={() => regenerateSection("content")}
                  >
                    Regenerate
                  </Button>
                </div>
                <Textarea
                  placeholder="Main lesson content in markdown format"
                  fullWidth
                  className="font-mono h-64"
                  {...register("content")}
                  error={errors.content?.message}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Key Terms
                </label>
                <div className="space-y-3">
                  {keyTerms.map((_, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">
                          Term {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeKeyTerm(index)}
                          disabled={keyTerms.length <= 1}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input
                          placeholder="Term"
                          fullWidth
                          {...register(`keyTerms.${index}.term`)}
                          error={errors.keyTerms?.[index]?.term?.message}
                        />
                        <Input
                          placeholder="Definition"
                          fullWidth
                          {...register(`keyTerms.${index}.definition`)}
                          error={errors.keyTerms?.[index]?.definition?.message}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  leftIcon={<FiPlus />}
                  onClick={addKeyTerm}
                >
                  Add Key Term
                </Button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Activities
                </label>
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={index}
                      className="p-4 bg-indigo-50 rounded-md border border-indigo-100"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-indigo-800">
                          Activity {index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeActivity(index)}
                          disabled={activities.length <= 1}
                        >
                          <FiTrash2 />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <Input
                          placeholder="Activity title"
                          fullWidth
                          {...register(`activities.${index}.title`)}
                          error={errors.activities?.[index]?.title?.message}
                        />
                        <Textarea
                          placeholder="Activity description"
                          fullWidth
                          {...register(`activities.${index}.description`)}
                          error={
                            errors.activities?.[index]?.description?.message
                          }
                        />
                        <Select
                          label="Activity Type"
                          options={[
                            { value: "quiz", label: "Quiz" },
                            { value: "discussion", label: "Discussion" },
                            { value: "assignment", label: "Assignment" },
                            { value: "exercise", label: "Exercise" },
                          ]}
                          fullWidth
                          {...register(`activities.${index}.type`)}
                          error={errors.activities?.[index]?.type?.message}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  leftIcon={<FiPlus />}
                  onClick={addActivity}
                >
                  Add Activity
                </Button>
              </div>

              <Input
                type="number"
                label="Estimated Time (minutes)"
                fullWidth
                {...register("estimatedTime", { valueAsNumber: true })}
                error={errors.estimatedTime?.message}
              />
            </div>
          </Card>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSaving}
              leftIcon={<FiSave />}
            >
              {isSaving ? "Saving..." : "Save Lesson"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LessonEditor;
