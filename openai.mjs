import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateCompletion(system, prompt, model = 'gpt-4o') {
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

  const result = await generateCompletion(system, prompt);
  return JSON.parse(result);
}
