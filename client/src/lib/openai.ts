import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const OPENAI_MODEL = "gpt-4o";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateChatResponse(messages: ChatMessage[]) {
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature: 0.7,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw error;
  }
}

export async function generateTitle(messages: ChatMessage[]) {
  try {
    const prompt = [
      ...messages,
      {
        role: "user",
        content: "Based on this conversation, generate a concise title (max 5 words) that captures its essence. Respond with ONLY the title, nothing else."
      }
    ];

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: prompt,
      temperature: 0.7,
      max_tokens: 10
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    console.error("Error generating title:", error);
    return "New conversation";
  }
}

export async function generateSummary(messages: ChatMessage[]) {
  try {
    const prompt = [
      ...messages,
      {
        role: "user",
        content: "Generate a brief one-sentence summary of this conversation. Keep it under 100 characters."
      }
    ];

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: prompt,
      temperature: 0.7,
      max_tokens: 50
    });

    return response.choices[0].message.content?.trim();
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
}

export async function generateInsights(messages: ChatMessage[]) {
  try {
    const prompt = [
      {
        role: "system",
        content: 
          "You are an expert relationship psychologist. Analyze the conversation and generate emotional insights. " +
          "Return your analysis in JSON format with these sections: " +
          "1. emotions: array of objects with 'name', 'value' (0-100), and 'color' (use yellow-500, indigo-500, green-500, red-500, blue-500) " +
          "2. keyInsights: array of objects with 'title' and 'content' " +
          "3. reflectionQuestions: array of strings with thoughtful questions"
      },
      ...messages,
      {
        role: "user",
        content: "Generate relationship insights from this conversation in the JSON format specified."
      }
    ];

    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: prompt,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) return null;

    return JSON.parse(content);
  } catch (error) {
    console.error("Error generating insights:", error);
    return null;
  }
}
