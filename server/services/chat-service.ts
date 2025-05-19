import { 
  generateChatResponse, 
  generateTitle, 
  generateSummary,
  generateInsights,
  ChatMessage
} from "@/lib/openai";

// Using our own Conversation type to match storage
type Message = {
  id: number;
  conversationId: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
};

type Conversation = {
  id: string;
  title: string;
  summary: string;
  insights?: any;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
};

export class ChatService {
  // System prompt for the dating therapist context
  private systemPrompt = `
    You are an AI Dating Therapist specializing in emotional support for relationship challenges.
    
    Your role:
    - Provide empathetic, thoughtful responses to relationship questions and concerns
    - Help users understand their emotions and relationship patterns
    - Offer supportive insights based on attachment theory and relationship psychology
    - Ask thoughtful follow-up questions to deepen understanding
    - Format your responses in a conversational, supportive tone
    - Use line breaks and bullet points when appropriate to organize information
    - Never claim to be a licensed therapist or mental health professional
    - Always remind users that you provide supportive conversation, not professional therapy
    
    Communication style:
    - Warm, empathetic, and non-judgmental 
    - Balance validation with gentle challenges to unhelpful thought patterns
    - Use open-ended questions to encourage reflection
    - Avoid giving overly prescriptive advice
    - Focus on emotional understanding and healthy relationship patterns
    
    Important:
    - If a user discusses serious mental health issues like self-harm, suicidal thoughts, or abuse, gently encourage them to seek professional help
    - Never suggest you can replace human therapists or counselors
    - Maintain a supportive, growth-oriented approach that helps users build emotional intelligence
  `;

  /**
   * Generates an AI response for a conversation
   */
  async generateResponse(conversation: Conversation) {
    // Convert conversation messages to the format expected by OpenAI
    const messages: ChatMessage[] = [
      { role: "system", content: this.systemPrompt },
    ];

    // Add conversation history
    conversation.messages.forEach(message => {
      messages.push({
        role: message.sender === "user" ? "user" : "assistant",
        content: message.content,
      });
    });

    // Generate AI response
    const reply = await generateChatResponse(messages);

    // For conversations with at least 2 messages, generate title and summary
    let title = conversation.title;
    let summary = conversation.summary;
    let insights = null;

    if (conversation.messages.length >= 2 && (!title || title === "New conversation")) {
      title = await generateTitle(messages) || "New conversation";
    }

    if (conversation.messages.length >= 2 && !summary) {
      summary = await generateSummary(messages) || "";
    }

    // Generate insights after a few exchanges
    if (conversation.messages.length >= 4) {
      insights = await generateInsights(messages);
    }

    return {
      reply,
      title,
      summary,
      insights
    };
  }
}
