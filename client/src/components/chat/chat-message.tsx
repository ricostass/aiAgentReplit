import { RiMentalHealthLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Message } from "@/context/chat-context";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isAiMessage = message.sender === "ai";

  if (isAiMessage) {
    return (
      <div className="flex mb-4 max-w-3xl mx-auto">
        <div className="flex-shrink-0 mr-3">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <RiMentalHealthLine className="text-primary-600 text-sm" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-t-xl rounded-br-xl py-3 px-4 shadow-sm max-w-[80%] md:max-w-[70%]">
          {message.content.split('\n\n').map((paragraph, i) => {
            // Check if this is a bullet list
            if (paragraph.includes('\n- ')) {
              const [listTitle, ...listItems] = paragraph.split('\n- ');
              return (
                <div key={i}>
                  {listTitle && <p className="text-gray-800 mt-2">{listTitle}</p>}
                  <ul className="list-disc pl-5 mt-2 text-gray-800 space-y-1">
                    {listItems.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                </div>
              );
            }
            
            return (
              <p key={i} className={cn("text-gray-800", i > 0 && "mt-2")}>
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4 max-w-3xl mx-auto">
      <div className="bg-primary text-white rounded-t-xl rounded-bl-xl py-3 px-4 max-w-[80%] md:max-w-[70%]">
        <p>{message.content}</p>
      </div>
    </div>
  );
}
