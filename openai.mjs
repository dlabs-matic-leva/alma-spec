import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const defaultSystem = `You are an expert Next.js developer with extensive knowledge of Flowbite React. Provide concise, well-structured code for a dashboard layout with left sidebar navigation using Flowbite React components. 

Ensure the dashboard has a clean, modern look using Flowbite React components.

Important:
- Use TypeScript for all components.
- Ensure the component has a clean, modern look using Flowbite React components.
- Provide comprehensive TypeScript types for all props, state, and functions.
- When importing components from 'flowbite-react', use named imports (e.g., import { Sidebar, Navbar } from 'flowbite-react').
- When create components, use default named exports.
- When importing your own components, use default imports.
- Ensure all imports and exports are correctly named and matched.
- Use the 'use client' directive at the top of client components.
- Respond with a JSON object where each key is the file path and the value is the file content. Example {"file.tsx": "import React from 'react';"}
- Dont import files that don't exist.
- Dont hallucinate and be consistent.
- next/router is deprecated, use next/navigation
- correct syntax for "use client" is \`"use client";\` and it can only be at the top of the file.
`;

export async function generateCompletion(prompt, system = defaultSystem, model = 'gpt-4o') {
    const response = await openai.createChatCompletion({
        model: model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });

    return response.data.choices[0].message.content.trim();
}

export async function classifyEndpoints(jsonContent) {
  const system = "You are an API expert. Classify each endpoint in the given OpenAPI specification as either 'listing', 'details', 'create', or 'update'.";
  const prompt = `Here's an OpenAPI specification. Classify each endpoint and return the result as a JSON object where keys are the endpoints (in the format 'METHOD /path') and values are the classifications:

${jsonContent}`;

  const result = await generateCompletion(prompt, system);
  return JSON.parse(result);
}
