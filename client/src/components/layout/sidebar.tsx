import { useState } from "react";
import { RiMentalHealthLine, RiAddLine, RiUserLine, RiSettings4Line, RiCloseLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import { formatDistanceToNow } from "date-fns";

export default function Sidebar() {
  const { 
    conversations, 
    activeConversationId, 
    setActiveConversationId, 
    startNewConversation,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useChat();

  return (
    <aside 
      className={cn(
        "w-0 md:w-80 bg-white border-r border-gray-200 flex-shrink-0 h-full overflow-y-auto",
        "transition-all duration-300 transform", 
        isMobileSidebarOpen ? "translate-x-0 w-80" : "-translate-x-full md:translate-x-0",
        "z-50 md:z-auto absolute md:relative"
      )}
    >
      <div className="p-4 flex flex-col h-full">
        {/* App Logo and Title */}
        <div className="flex items-center mb-8 pt-2">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary-100">
            <RiMentalHealthLine className="text-xl text-primary-600" />
          </div>
          <h1 className="ml-3 text-xl font-heading font-bold text-gray-900">AI Dating Therapist</h1>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="ml-auto md:hidden text-gray-500 hover:text-gray-700"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>

        {/* New Chat Button */}
        <button 
          onClick={startNewConversation}
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-3 rounded-lg font-medium transition duration-150 mb-6"
        >
          <RiAddLine />
          <span>New Conversation</span>
        </button>
        
        {/* Conversation History */}
        <div className="flex-1 overflow-y-auto">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Recent Conversations</h2>
          
          {conversations.length === 0 ? (
            <div className="text-sm text-gray-500 italic px-3">
              No conversations yet
            </div>
          ) : (
            conversations.map((conversation) => (
              <div 
                key={conversation.id}
                onClick={() => setActiveConversationId(conversation.id)}
                className={cn(
                  "mb-2 hover:bg-gray-50 rounded-lg transition cursor-pointer",
                  activeConversationId === conversation.id && "bg-gray-100"
                )}
              >
                <div className="p-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                      {conversation.title || "New conversation"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(conversation.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {conversation.summary || "Start a new conversation..."}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {/* User Profile Section */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
              <RiUserLine />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">User</p>
              <p className="text-xs text-gray-500">Free Plan</p>
            </div>
            <button className="ml-auto text-gray-400 hover:text-gray-600">
              <RiSettings4Line />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
