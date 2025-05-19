import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { RiSendPlaneFill, RiEmotionLine } from "react-icons/ri";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [message]);

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Enter (without Shift)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="max-w-3xl mx-auto">
        <form 
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="flex-1 bg-gray-100 rounded-lg hover:bg-gray-50 transition border border-gray-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100">
            <textarea 
              ref={textareaRef}
              rows={1} 
              className="w-full bg-transparent border-0 resize-none focus:ring-0 p-3 max-h-32 text-gray-800 placeholder-gray-500" 
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <div className="px-3 py-2 flex border-t border-gray-200">
              <button type="button" className="text-gray-500 hover:text-gray-700 mr-2">
                <RiEmotionLine />
              </button>
            </div>
          </div>
          <button 
            type="submit" 
            className="bg-primary hover:bg-primary/90 text-white p-3 rounded-lg flex-shrink-0 transition"
          >
            <RiSendPlaneFill />
          </button>
        </form>
        
        {/* Emotional Support Feedback */}
        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
          <div>AI responses are for support only, not professional therapy</div>
          <div className="flex items-center">
            <span className="mr-2">Emotional tone:</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Supportive
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
