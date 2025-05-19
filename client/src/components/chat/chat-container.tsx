import { useRef, useEffect } from "react";
import { RiMentalHealthLine } from "react-icons/ri";
import ChatMessage from "./chat-message";
import TypingIndicator from "./typing-indicator";
import { useChat } from "@/hooks/use-chat";

export default function ChatContainer() {
  const { activeConversation, isAiTyping } = useChat();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change or when AI is typing
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeConversation?.messages, isAiTyping]);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6" 
      id="chatContainer"
    >
      {(!activeConversation || activeConversation.messages.length === 0) ? (
        // Welcome Card
        <div className="mb-6 bg-white rounded-xl shadow-sm p-5 max-w-3xl mx-auto">
          <div className="flex items-start">
            <div className="w-10 h-10 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center">
              <RiMentalHealthLine className="text-primary-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-heading font-bold text-lg text-gray-900">Welcome</h3>
              <p className="text-gray-600 mt-1">
                I'm your AI Dating Therapist. I'm here to help you navigate your relationship questions and feelings. 
                What's on your mind today?
              </p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition">
              Help me understand my feelings
            </button>
            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition">
              I'm confused about a relationship
            </button>
            <button className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition">
              Dating app anxiety
            </button>
          </div>
        </div>
      ) : (
        // Chat Messages
        activeConversation.messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message}
          />
        ))
      )}

      {/* AI Typing Indicator */}
      {isAiTyping && <TypingIndicator />}
    </div>
  );
}
