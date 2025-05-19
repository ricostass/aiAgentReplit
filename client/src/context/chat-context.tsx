import { createContext, useCallback, useState, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { apiRequest } from '@/lib/queryClient';

// Types
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface Emotion {
  name: string;
  value: number;
  color: string;
}

export interface KeyInsight {
  title: string;
  content: string;
}

export interface Insights {
  emotions: Emotion[];
  keyInsights: KeyInsight[];
  reflectionQuestions: string[];
}

export interface Conversation {
  id: string;
  title: string;
  summary: string;
  messages: Message[];
  createdAt: string;
  insights?: Insights;
}

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  isAiTyping: boolean;
  isMobileSidebarOpen: boolean;
  isInsightPanelOpen: boolean;
  setActiveConversationId: (id: string) => void;
  startNewConversation: () => void;
  sendMessage: (content: string) => void;
  loadConversations: () => void;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
  setIsInsightPanelOpen: (isOpen: boolean) => void;
}

// Default context
export const ChatContext = createContext<ChatContextType>({
  conversations: [],
  activeConversationId: null,
  activeConversation: null,
  isAiTyping: false,
  isMobileSidebarOpen: false,
  isInsightPanelOpen: false,
  setActiveConversationId: () => {},
  startNewConversation: () => {},
  sendMessage: () => {},
  loadConversations: () => {},
  setIsMobileSidebarOpen: () => {},
  setIsInsightPanelOpen: () => {},
});

// Provider component
export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isInsightPanelOpen, setIsInsightPanelOpen] = useState(false);

  // Get active conversation
  const activeConversation = activeConversationId 
    ? conversations.find(c => c.id === activeConversationId) || null
    : null;

  // Load conversations from server
  const loadConversations = useCallback(async () => {
    try {
      const response = await apiRequest('GET', '/api/conversations', undefined);
      const data = await response.json();
      
      if (data.conversations && Array.isArray(data.conversations)) {
        setConversations(data.conversations);
        
        // If we have conversations but no active one, set the first as active
        if (data.conversations.length > 0 && !activeConversationId) {
          setActiveConversationId(data.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
      // Create a new conversation if none exist
      if (conversations.length === 0) {
        startNewConversation();
      }
    }
  }, [activeConversationId, conversations.length]);

  // Start a new conversation
  const startNewConversation = useCallback(() => {
    const newConversation: Conversation = {
      id: nanoid(),
      title: 'New conversation',
      summary: '',
      messages: [],
      createdAt: new Date().toISOString(),
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    
    // Close mobile sidebar when starting new conversation
    setIsMobileSidebarOpen(false);
  }, []);

  // Send a message
  const sendMessage = useCallback(async (content: string) => {
    if (!activeConversationId) {
      // Create a new conversation if none is active
      const newId = nanoid();
      const newConversation: Conversation = {
        id: newId,
        title: 'New conversation',
        summary: '',
        messages: [],
        createdAt: new Date().toISOString(),
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newId);
      
      // Now add the message to this new conversation
      const userMessage: Message = {
        id: nanoid(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === newId 
            ? { ...conv, messages: [...conv.messages, userMessage] }
            : conv
        )
      );
      
      // Start AI typing
      setIsAiTyping(true);
      
      try {
        const response = await apiRequest('POST', '/api/chat', {
          conversationId: newId,
          message: content,
        });
        
        const data = await response.json();
        
        // Add AI response to conversation
        const aiMessage: Message = {
          id: nanoid(),
          content: data.reply,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        
        setConversations(prev => 
          prev.map(conv => 
            conv.id === newId 
              ? { 
                  ...conv, 
                  messages: [...conv.messages, aiMessage],
                  title: data.title || conv.title,
                  summary: data.summary || conv.summary,
                  insights: data.insights || conv.insights,
                }
              : conv
          )
        );
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setIsAiTyping(false);
      }
    } else {
      // Add user message to existing conversation
      const userMessage: Message = {
        id: nanoid(),
        content,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      
      setConversations(prev => 
        prev.map(conv => 
          conv.id === activeConversationId 
            ? { ...conv, messages: [...conv.messages, userMessage] }
            : conv
        )
      );
      
      // Start AI typing
      setIsAiTyping(true);
      
      try {
        const response = await apiRequest('POST', '/api/chat', {
          conversationId: activeConversationId,
          message: content,
        });
        
        const data = await response.json();
        
        // Add AI response to conversation
        const aiMessage: Message = {
          id: nanoid(),
          content: data.reply,
          sender: 'ai',
          timestamp: new Date().toISOString(),
        };
        
        setConversations(prev => 
          prev.map(conv => 
            conv.id === activeConversationId 
              ? { 
                  ...conv, 
                  messages: [...conv.messages, aiMessage],
                  title: data.title || conv.title,
                  summary: data.summary || conv.summary,
                  insights: data.insights || conv.insights,
                }
              : conv
          )
        );
      } catch (error) {
        console.error('Failed to get AI response:', error);
      } finally {
        setIsAiTyping(false);
      }
    }
  }, [activeConversationId]);

  const contextValue: ChatContextType = {
    conversations,
    activeConversationId,
    activeConversation,
    isAiTyping,
    isMobileSidebarOpen,
    isInsightPanelOpen,
    setActiveConversationId,
    startNewConversation,
    sendMessage,
    loadConversations,
    setIsMobileSidebarOpen,
    setIsInsightPanelOpen,
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
}
