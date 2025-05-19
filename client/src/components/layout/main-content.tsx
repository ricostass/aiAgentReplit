import { useRef, useEffect } from "react";
import { RiMenuLine, RiBookmarkLine, RiShareLine } from "react-icons/ri";
import ChatContainer from "@/components/chat/chat-container";
import ChatInput from "@/components/chat/chat-input";
import { useChat } from "@/hooks/use-chat";

export default function MainContent() {
  const { 
    activeConversation, 
    isMobileSidebarOpen, 
    setIsMobileSidebarOpen,
    setIsInsightPanelOpen,
    sendMessage
  } = useChat();

  const handleSendMessage = (message: string) => {
    if (message.trim()) {
      sendMessage(message);
    }
  };

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
        <button 
          onClick={() => setIsMobileSidebarOpen(true)}
          className="mr-3 text-gray-500 hover:text-gray-700 md:hidden"
        >
          <RiMenuLine className="text-xl" />
        </button>
        <h2 className="font-medium text-gray-900">
          {activeConversation?.title || "New Conversation"}
        </h2>
        <div className="ml-auto flex items-center space-x-3">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500" 
            title="Bookmark this conversation"
          >
            <RiBookmarkLine />
          </button>
          <button 
            onClick={() => setIsInsightPanelOpen(true)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500" 
            title="View insights"
          >
            <RiShareLine />
          </button>
        </div>
      </header>

      {/* Chat Container */}
      <ChatContainer />

      {/* Chat Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </main>
  );
}
