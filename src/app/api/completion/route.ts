import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";
import { createTrainingPlan } from "@/controllers/plans.controller";
import { nanoid } from "nanoid";
import { auth } from "@clerk/nextjs";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

import { ChatOpenAI } from "@langchain/openai";
import { JsonOutputFunctionsParser } from "langchain/output_parsers";
import {
  type ChatPromptTemplate,
  SystemMessagePromptTemplate,
  HumanMessagePromptTemplate,
} from "@langchain/core/prompts";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { pull } from "langchain/hub";
import { DynamicStructuredTool } from "@langchain/core/tools";

export const runtime = "nodejs";

const model = new ChatOpenAI({
  temperature: 0.1,
  modelName: 'gpt-4',
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const tools = new DynamicStructuredTool({
  name: "training_plan_parser",
  description: "Parses a training plan text into a structured JSON object",
  func(input, runManager, config) {
    return Promise.resolve(JSON.stringify(input));
  },
  schema: z.object({
    userId: z.string().describe("the user id provided by the user"),
    start_date: z
      .string()
      .describe("the start date of the training plan provided by the user"),
    end_date: z
      .string()
      .describe("the end date of the training plan provided by the user"),
    weeks: z
      .array(
        z.object({
          id: z.string().optional().describe("the id of the week"),
          trainingPlanId: z
            .string()
            .optional()
            .describe("the id of the training plan"),
          weekNumber: z.number().describe("the number of the week"),
          days: z
            .array(
              z.object({
                id: z.string().optional().describe("the id of the day"),
                weekId: z.string().optional().describe("the id of the week"),
                day_en: z
                  .enum([
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THURSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY",
                  ])
                  .describe("the name of the day in English"),
                activities: z
                  .array(
                    z.object({
                      id: z
                        .string()
                        .optional()
                        .describe("the id of the activity"),
                      dayId: z
                        .string()
                        .optional()
                        .describe("the id of the day"),
                      type: z
                        .enum([
                          "MOBILITY",
                          "WEIGHTLIFTING",
                          "CARDIO",
                          "TABATA",
                          "CORE",
                          "STRETCHING",
                          "REST",
                          "AMRAP",
                          "EMOM",
                          "FOR_TIME",
                          "OTHER",
                        ])
                        .describe("the type of the activity"),
                      details: z
                        .object({
                          id: z
                            .string()
                            .optional()
                            .describe("the id of the details"),
                          activityId: z
                            .string()
                            .optional()
                            .describe("the id of the activity"),
                          name: z.string().describe("the name of the activity"),
                          rounds: z
                            .string()
                            .optional()
                            .describe("the rounds of the activity"),
                          reps: z
                            .string()
                            .optional()
                            .describe("the reps of the activity"),
                          sets: z
                            .string()
                            .optional()
                            .describe("the sets of the activity"),
                          weight: z
                            .number()
                            .optional()
                            .describe("the weight of the activity"),
                          duration: z
                            .number()
                            .optional()
                            .describe("the duration of the activity"),
                          intensity: z
                            .number()
                            .optional()
                            .describe("the intensity of the activity"),
                          work_interval: z
                            .string()
                            .optional()
                            .describe("the work interval of the activity"),
                          rest_interval: z
                            .string()
                            .optional()
                            .describe("the rest interval of the activity"),
                          RPE: z
                            .string()
                            .optional()
                            .describe("the RPE of the activity"),
                          notes: z
                            .string()
                            .optional()
                            .describe("the notes of the activity"),
                        })
                        .describe("the details of the activity"),
                    })
                  )
                  .describe("the activities of the day"),
              })
            )
            .describe("the days of the week"),
        })
      )
      .describe("the weeks of the training plan"),
  }),
});

/* const trainingPlanSchema = z.object({
  userId: z.string().describe("the user id provided by the user"),
  start_date: z
    .string()
    .describe("the start date of the training plan provided by the user"),
  end_date: z
    .string()
    .describe("the end date of the training plan provided by the user"),
  weeks: z
    .array(
      z.object({
        id: z.string().optional().describe("the id of the week"),
        trainingPlanId: z
          .string()
          .optional()
          .describe("the id of the training plan"),
        weekNumber: z.number().describe("the number of the week"),
        days: z
          .array(
            z.object({
              id: z.string().optional().describe("the id of the day"),
              weekId: z.string().optional().describe("the id of the week"),
              day_en: z
                .enum([
                  "MONDAY",
                  "TUESDAY",
                  "WEDNESDAY",
                  "THURSDAY",
                  "FRIDAY",
                  "SATURDAY",
                  "SUNDAY",
                ])
                .describe("the name of the day in English"),
              activities: z
                .array(
                  z.object({
                    id: z
                      .string()
                      .optional()
                      .describe("the id of the activity"),
                    dayId: z.string().optional().describe("the id of the day"),
                    type: z
                      .enum([
                        "MOBILITY",
                        "WEIGHTLIFTING",
                        "CARDIO",
                        "TABATA",
                        "CORE",
                        "STRETCHING",
                        "REST",
                        "AMRAP",
                        "EMOM",
                        "FOR_TIME",
                        "OTHER",
                      ])
                      .describe("the type of the activity"),
                    details: z
                      .object({
                        id: z
                          .string()
                          .optional()
                          .describe("the id of the details"),
                        activityId: z
                          .string()
                          .optional()
                          .describe("the id of the activity"),
                        name: z.string().describe("the name of the activity"),
                        rounds: z
                          .string()
                          .optional()
                          .describe("the rounds of the activity"),
                        reps: z
                          .string()
                          .optional()
                          .describe("the reps of the activity"),
                        sets: z
                          .string()
                          .optional()
                          .describe("the sets of the activity"),
                        weight: z
                          .number()
                          .optional()
                          .describe("the weight of the activity"),
                        duration: z
                          .number()
                          .optional()
                          .describe("the duration of the activity"),
                        intensity: z
                          .number()
                          .optional()
                          .describe("the intensity of the activity"),
                        work_interval: z
                          .string()
                          .optional()
                          .describe("the work interval of the activity"),
                        rest_interval: z
                          .string()
                          .optional()
                          .describe("the rest interval of the activity"),
                        RPE: z
                          .string()
                          .optional()
                          .describe("the RPE of the activity"),
                        notes: z
                          .string()
                          .optional()
                          .describe("the notes of the activity"),
                      })
                      .describe("the details of the activity"),
                  })
                )
                .describe("the activities of the day"),
            })
          )
          .describe("the days of the week"),
      })
    )
    .describe("the weeks of the training plan"),
}); */

function parseStringToJSON(string: string) {
  return JSON.parse(string);
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const startDate = body.get("start_date");
  const endDate = body.get("end_date");
  const { userId } = auth();

  if (!body) {
    return new Response("No file found", { status: 400 });
  }

  const text = await fetch(`${process.env.API_URL}/api/ocr`, {
    method: "POST",
    body: body,
  });

  if (!text) {
    return new Response("Error processing file", { status: 500 });
  }

  const textBody = await text.text();

  /* const TEMPLATE = `
Transform the provided training plan text into a structured JSON object adhering to the specified schema. The schema outlines a structure for training plans, including fields for "start_date", "end_date", and a list of "days" with activities for each day. Each day should include the day's name in English ("day_en") and Spanish ("day_es"), and list the "activities" planned for that day. Activities should be categorized by "type" such as "Mobility", "Weightlifting", "Cardio", or "Tabata", with each activity containing a list of "exercises". Each exercise should detail the "name", and depending on the type, include specifics like "rounds", "reps", "sets", "weight", "duration", "intensity", "work_interval", "rest_interval", "RPE", and an optional field for "notes".

Start Date: ${startDate}
End Date: ${endDate}

Please ensure the converted JSON follows this structure precisely, capturing the essence and details of the training plan from the text. The aim is to parse varying formats and contents from the text, organizing them into the coherent and structured JSON format as defined by the schema.

Text:
${textBody}

Remember, the JSON object must strictly follow the provided schema, accommodating the diverse types of exercises and training details mentioned in the plan.
`; */

  /* const TEMPLATE = `
Transform the provided training plan text into a structured JSON object adhering to the specified schema. The schema outlines a hierarchical structure for training plans, including fields for "user_id", "created_at", "updated_at", a "training_plan" object with "id", "start_date", and "end_date". Inside the "training_plan", there should be a "weekly_progress" array, where each item represents a week with a "week_number" and a list of "days". Each day includes the day's name in Spanish ("day"), and lists the "activities" planned for that day. Activities should be categorized by "type" such as "Mobility", "Weightlifting", "Cardio", or "Tabata", with each activity containing a list of "exercises". Each exercise should detail the "name", and, depending on the type, include specifics like "rounds", "reps", "sets", "weight", "duration", "intensity", "work_interval", "rest_interval", "RPE", and an optional field for "notes".

User ID: ${userId}
Created At: ${createdAt}
Updated At: ${updatedAt}
Training Plan ID: ${trainingPlanId}
Start Date: ${startDate}
End Date: ${endDate}

Please ensure the converted JSON follows this structure precisely, capturing the essence and details of the training plan from the text. The aim is to parse varying formats and contents from the text, organizing them into the coherent and structured JSON format as defined by the schema, with an emphasis on weekly progress tracking.

Text:
${textBody}

Remember, the JSON object must strictly follow the provided schema, accommodating the diverse types of exercises and training details mentioned in the plan, and allowing for the tracking of progress on a weekly basis.
`; */

  /* const prompt = new ChatPromptTemplate({
  promptMessages: [
    SystemMessagePromptTemplate.fromTemplate(
      "List all food items mentioned in the following text."
    ),
    HumanMessagePromptTemplate.fromTemplate("{inputText}"),
  ],
  inputVariables: ["inputText"],
}); */

  /* const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(
        "Transform the provided training plan text into a structured JSON object suitable for insertion into a PostgreSQL database using Prisma ORM, following the provided JSON schema for 'days', 'activities', and 'details'. The schema defines the expected structure for each part of the training plan, ensuring consistency and flexibility in data format."
      ),
      HumanMessagePromptTemplate.fromTemplate(`
        User ID: {userId}
        Start Date: {startDate}
        End Date: {endDate}
        Text: {inputText}
      `),
    ],
    inputVariables: ["userId", "startDate", "endDate", "inputText"],
  }); */

  const TEMPLATE = `Transform the provided training plan text into a structured JSON object suitable for insertion into a PostgreSQL database using Prisma ORM, following the provided JSON schema for "days", "activities", and "details". The schema defines the expected structure for each part of the training plan, ensuring consistency and flexibility in data format.

User ID: ${userId}
Start Date: ${startDate}
End Date: ${endDate}

Text:
${textBody}

The JSON object must adhere to the provided schema, organizing the diverse types of exercises and training specifics mentioned in the plan into a coherent structure for database insertion. This approach allows for dynamic adjustments to the data structure without modifying the prompt, facilitating efficient data manipulation and integration.
`;

  try {
    const prompt = await pull<ChatPromptTemplate>(
      "hwchase17/openai-functions-agent"
    );

    const agent = await createOpenAIFunctionsAgent({
      llm: model,
      tools: [tools],
      prompt,
    });

    const agentExecutor = new AgentExecutor({
      agent,
      tools: [tools],
      verbose: true,
      handleParsingErrors:
        "Please try again. There was an error parsing the response.",
    });

    console.log("Loaded agent.");

    const input = TEMPLATE;

    const result = await agentExecutor.invoke({ input });

    console.log("RESULT", result);
    /* const llm = new ChatOpenAI({
      modelName: process.env.AI_MODEL,
      temperature: 0,
    });

    const functionCallingModel = llm.bind({
      functions: [
        {
          name: "output_formatter",
          description: "Should always be used to properly format output",
          parameters: zodToJsonSchema(trainingPlanSchema),
        },
      ],
      function_call: { name: "output_formatter" },
    });

    const outputParser = new JsonOutputFunctionsParser();

    const chain = prompt.pipe(functionCallingModel).pipe(outputParser);

    const response = await chain.invoke({
      inputText: textBody,
      userId: userId,
      startDate: startDate,
      endDate: endDate,
    }); */

    /* const response = await openai.chat.completions.create({
    model: process.env.AI_MODEL ?? "",
    stream: true,
    messages: [
      {
        role: "system",
        content: TEMPLATE,
      },
    ],
  }); */

    /* const stream = OpenAIStream(response); */
    /* const stream = OpenAIStream(response, {
    onStart: async () => {
      // This callback is called when the stream starts
      // You can use this to save the prompt to your database
      await savePromptToDatabase(prompt);
    },
    onToken: async (token: string) => {
      // This callback is called for each token in the stream
      // You can use this to debug the stream or save the tokens to your database
      console.log(token);
    },
    onCompletion: async (completion: string) => {
      // This callback is called when the stream completes
      // You can use this to save the final completion to your database
      //await saveCompletionToDatabase(completion);

      const parsedPlan = parseStringToJSON(completion);
      console.log("$$$$$$$ PARSED $$$$$$$", parsedPlan)


      await createTrainingPlan(parsedPlan)
    },
  }); */

    console.log("$$$$$$$ CREADO $$$$$$$", {result});
    return NextResponse.json(result);
  } catch (error) {
    // Check if the error is an APIError
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      throw error;
    }
  }
}
