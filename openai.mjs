import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function generateCompletion(system, prompt, model = 'gpt-4-turbo') {
    const response = await openai.createChatCompletion({
        model: model,
        messages: [{ role: 'system', content: system }, { role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
    });

    return response.data.choices[0].message.content.trim();
}

