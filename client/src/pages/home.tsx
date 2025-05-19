import { useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import MainContent from "@/components/layout/main-content";
import InsightPanel from "@/components/insights/insight-panel";
import { useChat } from "@/hooks/use-chat";

export default function Home() {
  const { 
    isInsightPanelOpen, 
    setIsInsightPanelOpen,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    activeConversation,
    loadConversations
  } = useChat();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Mobile Menu Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      <div className="flex flex-1 h-full overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>

      <InsightPanel 
        isOpen={isInsightPanelOpen} 
        onClose={() => setIsInsightPanelOpen(false)}
        insights={activeConversation?.insights}
      />
    </div>
  );
}
