import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ChatService } from "./services/chat-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create chat service
  const chatService = new ChatService();

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
      
      // Get the conversation
      let conversation = await storage.getConversation(conversationId);
      
      if (!conversation) {
        // Create new conversation if it doesn't exist
        conversation = await storage.createConversation({
          title: 'New conversation',
          summary: '',
        });
      }
      
      // Add user message to conversation
      await storage.addMessage(conversation.id, {
        content: message,
        sender: 'user',
      });
      
      // Get updated conversation with the new message
      conversation = await storage.getConversation(conversation.id);
      
      if (!conversation) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
      
      // Get AI response
      const result = await chatService.generateResponse(conversation);
      
      // Add AI message to conversation
      await storage.addMessage(conversation.id, {
        content: result.reply,
        sender: 'ai',
      });
      
      // Update conversation title and summary if available
      if (result.title || result.summary) {
        await storage.updateConversation(conversation.id, {
          title: result.title || conversation.title,
          summary: result.summary || conversation.summary,
          insights: result.insights,
        });
      }
      
      res.json(result);
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
}
