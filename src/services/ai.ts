import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export interface LessonGenerationParams {
  topic: string;
  targetAudience: string;
  learningLevel: "beginner" | "intermediate" | "advanced";
  desiredOutcomes: string;
  additionalContext?: string;
}

export interface LessonContent {
  title: string;
  description: string;
  learningOutcomes: string[];
  content: string;
  keyTerms: { term: string; definition: string }[];
  activities: {
    title: string;
    description: string;
    type: "quiz" | "discussion" | "assignment" | "exercise";
    content: any;
  }[];
  estimatedTime: number;
}

export async function generateLesson(
  params: LessonGenerationParams
): Promise<LessonContent> {
  const {
    topic,
    targetAudience,
    learningLevel,
    desiredOutcomes,
    additionalContext,
  } = params;

  const prompt = `
    Create a comprehensive lesson on "${topic}" for ${targetAudience} at a ${learningLevel} level.
    
    The learning outcomes should include: ${desiredOutcomes}
    
    ${additionalContext ? `Additional context: ${additionalContext}` : ""}
    
    Format the response as a JSON object with the following structure:
    {
      "title": "An engaging title for the lesson",
      "description": "A brief overview of the lesson (2-3 sentences)",
      "learningOutcomes": ["Outcome 1", "Outcome 2", "Outcome 3"],
      "content": "The main content of the lesson in markdown format, including headings, paragraphs, lists, etc.",
      "keyTerms": [
        {"term": "Term 1", "definition": "Definition 1"},
        {"term": "Term 2", "definition": "Definition 2"}
      ],
      "activities": [
        {
          "title": "Activity title",
          "description": "Brief description of the activity",
          "type": "quiz|discussion|assignment|exercise",
          "content": {}
        }
      ],
      "estimatedTime": 30
    }
    
    For quiz activities, include 3-5 questions with multiple-choice answers and indicate the correct answer.
    For discussions, provide thought-provoking questions.
    For assignments, provide clear instructions and criteria.
    For exercises, provide step-by-step instructions.
    
    Make the content engaging, accurate, and pedagogically sound.
  `;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert educational content creator with expertise in instructional design.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 3000,
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) throw new Error("Failed to generate lesson content");

    return JSON.parse(content) as LessonContent;
  } catch (error) {
    console.error("Error generating lesson:", error);
    throw new Error("Failed to generate lesson content");
  }
}

export interface ModuleGenerationParams {
  courseTitle: string;
  courseDescription: string;
  numberOfModules: number;
  targetAudience: string;
  learningLevel: "beginner" | "intermediate" | "advanced";
}

export interface ModuleContent {
  title: string;
  description: string;
  order: number;
  lessonTopics: string[];
}

export async function generateModuleStructure(
  params: ModuleGenerationParams
): Promise<ModuleContent[]> {
  const {
    courseTitle,
    courseDescription,
    numberOfModules,
    targetAudience,
    learningLevel,
  } = params;

  const prompt = `
    Create a logical module structure for a course titled "${courseTitle}" with the following description:
    "${courseDescription}"
    
    The course should be divided into ${numberOfModules} modules, designed for ${targetAudience} at a ${learningLevel} level.
    
    Format the response as a JSON array with the following structure for each module:
    [
      {
        "title": "Module title",
        "description": "Brief description of the module (2-3 sentences)",
        "order": 1,
        "lessonTopics": ["Topic for Lesson 1", "Topic for Lesson 2", "Topic for Lesson 3"]
      }
    ]
    
    Ensure the modules follow a logical progression and cover the course topic comprehensively.
  `;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an expert curriculum designer with expertise in educational content organization.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) throw new Error("Failed to generate module structure");

    return JSON.parse(content) as ModuleContent[];
  } catch (error) {
    console.error("Error generating module structure:", error);
    throw new Error("Failed to generate module structure");
  }
}
