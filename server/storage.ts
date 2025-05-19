import { nanoid } from "nanoid";

// Define the types we need for our in-memory storage
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

type InsertMessage = {
  content: string;
  sender: 'user' | 'ai';
};

type InsertConversation = {
  id?: string;
  title: string;
  summary: string;
  insights?: any;
};

type UpdateConversation = Partial<{
  title: string;
  summary: string;
  insights: any;
}>;

// Storage interface
export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;

  // Conversation methods
  getConversations(): Promise<Conversation[]>;
  getConversation(id: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(id: string, updates: UpdateConversation): Promise<Conversation>;
  deleteConversation(id: string): Promise<void>;

  // Message methods
  addMessage(conversationId: string, message: InsertMessage): Promise<Message>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private conversations: Map<string, Omit<Conversation, 'messages'>>;
  private messages: Map<string, Message[]>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.currentId = 1;
  }

  // User methods (simplified since they're not the focus)
  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: any): Promise<any> {
    const id = this.currentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }

  // Conversation methods
  async getConversations(): Promise<Conversation[]> {
    // Map the conversations to include their messages
    return Array.from(this.conversations.values())
      .map(conversation => ({
        ...conversation,
        messages: this.messages.get(conversation.id) || []
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(id);
    if (!conversation) return undefined;

    // Return conversation with its messages
    return {
      ...conversation,
      messages: this.messages.get(id) || []
    };
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = conversation.id || nanoid();
    const now = new Date().toISOString();
    
    const newConversation = {
      ...conversation,
      id,
      createdAt: now,
      updatedAt: now,
    };

    this.conversations.set(id, newConversation);
    this.messages.set(id, []);
    
    return {
      ...newConversation,
      messages: []
    };
  }

  async updateConversation(id: string, updates: UpdateConversation): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    
    if (!conversation) {
      throw new Error(`Conversation with id ${id} not found`);
    }

    const updatedConversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.conversations.set(id, updatedConversation);

    return {
      ...updatedConversation,
      messages: this.messages.get(id) || []
    };
  }

  async deleteConversation(id: string): Promise<void> {
    this.conversations.delete(id);
    this.messages.delete(id);
  }

  // Message methods
  async addMessage(conversationId: string, message: InsertMessage): Promise<Message> {
    if (!this.conversations.has(conversationId)) {
      throw new Error(`Conversation with id ${conversationId} not found`);
    }

    // Update conversation's updatedAt timestamp
    const conversation = this.conversations.get(conversationId)!;
    this.conversations.set(conversationId, {
      ...conversation,
      updatedAt: new Date().toISOString()
    });

    // Create the new message
    const messageId = (this.messages.get(conversationId)?.length || 0) + 1;
    const newMessage: Message = {
      id: messageId,
      conversationId,
      content: message.content,
      sender: message.sender,
      timestamp: new Date().toISOString()
    };

    // Add to messages map
    const conversationMessages = this.messages.get(conversationId) || [];
    this.messages.set(conversationId, [...conversationMessages, newMessage]);

    return newMessage;
  }
}

export const storage = new MemStorage();
