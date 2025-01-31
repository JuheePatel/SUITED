import OpenAI from "openai";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

// Define the schema for "original" tab
const OriginalResumeSchema = z.object({
  personalInfo: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string(),
    location: z.string(),
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      duration: z.string(),
      responsibilities: z.array(z.string()),
    })
  ),
  education: z.object({
    university: z.string(),
    degree: z.string(),
    year: z.string(),
  }),
  skills: z.array(z.string()),
});

// Define the schema for "transformed" tab
const TransformedResumeSchema = z.object({
  candidateId: z.string(),
  competencyArea: z.string(),
  skills: z.object({
    technical: z.array(z.string()),
    core: z.array(z.string()),
  }),
  experience: z.object({
    totalYears: z.number(),
    level: z.string(),
    domains: z.array(z.string()),
    achievements: z.array(z.string()),
  }),
  competencyMetrics: z.object({
    technical: z.number(),
    leadership: z.number(),
    problemSolving: z.number(),
    communication: z.number(),
  }),
  educationLevel: z.string(),
  certificationLevel: z.string(),
});

export async function anonymizeResume(resume, activeTab) {
  const schema =
    activeTab === "original"
      ? OriginalResumeSchema
      : activeTab === "transformed"
      ? TransformedResumeSchema
      : null;

  if (!schema) {
    throw new Error("Invalid activeTab value. Must be 'original' or 'transformed'.");
  }

  const messages = [
    {
      role: "system",
      content: activeTab === "original"
        ? "You are an expert at structured data extraction. Extract resume details into the given JSON schema."
        : "You are an anonymization expert. Convert the resume into an anonymized profile using the given JSON schema.",
    },
    { role: "user", content: resume },
  ];

  const completion = await openai.beta.chat.completions.parse({
    model: "gpt-4o-2024-08-06",
    messages,
    response_format: zodResponseFormat(schema, activeTab === "original" ? "original_resume" : "transformed_resume"),
  });

  // Extract and return the parsed response
  const parsedResume = completion.choices[0].message.parsed;
  return parsedResume;
}
