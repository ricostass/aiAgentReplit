import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
// Import OpenAI client directly for server-side use
import { OpenAI } from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

export async function registerRoutes(app: Express): Promise<Server> {
  try {
    // Instantiate OpenAI using the server's API key from process.env
    const openai = new OpenAI();

    // Get all conversations
    app.get('/api/conversations', async (req, res) => {
      try {
        const conversations = await storage.getConversations();
        res.json({ conversations });
      } catch (error) {
        console.error('Error getting conversations:', error);
        res.status(500).json({ message: 'Failed to get conversations' });
      }
    });

    // Get a specific conversation
    app.get('/api/conversations/:id', async (req, res) => {
      try {
        const conversation = await storage.getConversation(req.params.id);
        if (!conversation) {
          return res.status(404).json({ message: 'Conversation not found' });
        }
        res.json({ conversation });
      } catch (error) {
        console.error('Error getting conversation:', error);
        res.status(500).json({ message: 'Failed to get conversation' });
      }
    });

    // Create a new conversation
    app.post('/api/conversations', async (req, res) => {
      try {
        const conversation = await storage.createConversation({
          title: req.body.title || 'New conversation',
          summary: req.body.summary || '',
        });
        res.status(201).json({ conversation });
      } catch (error) {
        console.error('Error creating conversation:', error);
        res.status(500).json({ message: 'Failed to create conversation' });
      }
    });

    // Send a message and get AI response
    app.post('/api/chat', async (req, res) => {
      try {
        const { conversationId, message } = req.body;
        if (!conversationId || !message) {
          return res.status(400).json({ message: 'Conversation ID and message are required' });
        }

        // Retrieve or initialize conversation
        let conversation = await storage.getConversation(conversationId);
        if (!conversation) {
          conversation = await storage.createConversation({ title: 'New conversation', summary: '' });
        }

        // Add user message
        await storage.addMessage(conversation.id, { content: message, sender: 'user' });
        conversation = await storage.getConversation(conversation.id);
        if (!conversation) {
          return res.status(404).json({ message: 'Conversation not found' });
        }
        // Compose messages for OpenAI
        const messages: ChatCompletionMessageParam[] = conversation.messages.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        }));
        // Append the new user message at the end
        messages.push({ role: 'user', content: message });

        // Call OpenAI to generate a response
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages,
        });
        const aiReply = completion.choices?.[0]?.message?.content || "I'm having trouble processing your message right now.";

        // Add AI message to conversation
        await storage.addMessage(conversation.id, { content: aiReply, sender: 'ai' });

        // Return the reply
        res.json({ reply: aiReply });
      } catch (error) {
        console.error('Error in chat:', error);
        res.status(500).json({
          message: 'Failed to process chat message',
          reply: "I'm sorry, I'm having trouble processing your message right now. Please try again later."
        });
      }
    });

    const httpServer = createServer(app);
    return httpServer;
  } catch (error) {
    console.error('Error registering routes:', error);
    // You must throw or return a Server here to satisfy the return type
    throw error;
  }
}
