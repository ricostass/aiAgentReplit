import { RiCloseLine, RiDownloadLine } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { Insights } from "@/context/chat-context";

interface InsightPanelProps {
  isOpen: boolean;
  onClose: () => void;
  insights?: Insights;
}

export default function InsightPanel({ isOpen, onClose, insights }: InsightPanelProps) {
  // Default mock insights if none provided
  const defaultInsights: Insights = {
    emotions: [
      { name: "Anxiety", value: 70, color: "yellow-500" },
      { name: "Uncertainty", value: 60, color: "indigo-500" },
      { name: "Hopefulness", value: 40, color: "green-500" }
    ],
    keyInsights: [
      { title: "Anxious-Avoidant Dynamic", content: "You appear to show anxious attachment tendencies in response to your date's avoidant behaviors." },
      { title: "Communication Style", content: "You tend to avoid direct conversations about relationship concerns, possibly fearing rejection." },
      { title: "Emotional Pattern", content: "Your anxiety increases when your partner withdraws, creating a cycle of uncertainty." }
    ],
    reflectionQuestions: [
      "What happens in your body when you notice this person pulling away?",
      "How does this current dynamic compare to patterns in your past relationships?",
      "What would feel like a \"secure\" relationship to you right now?"
    ]
  };

  const displayInsights = insights || defaultInsights;

  return (
    <div 
      className={cn(
        "fixed inset-y-0 right-0 w-72 bg-white border-l border-gray-200 shadow-lg z-50",
        "transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      <div className="p-4 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading font-bold text-gray-900">Emotional Insights</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <RiCloseLine className="text-xl" />
          </button>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Current Session</h4>
          <div className="space-y-2">
            {displayInsights.emotions.map((emotion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{emotion.name}</span>
                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`bg-${emotion.color} h-2 rounded-full`} 
                    style={{ width: `${emotion.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Key Insights</h4>
          <ul className="space-y-3">
            {displayInsights.keyInsights.map((insight, index) => (
              <li key={index} className="bg-white p-3 rounded-lg border border-gray-200 text-xs text-gray-700">
                <div className="font-medium text-gray-900 mb-1">{insight.title}</div>
                {insight.content}
              </li>
            ))}
          </ul>
          
          <h4 className="text-sm font-medium text-gray-700 mt-6 mb-2">Reflection Questions</h4>
          <ul className="space-y-2">
            {displayInsights.reflectionQuestions.map((question, index) => (
              <li key={index} className="bg-primary-50 p-3 rounded-lg text-xs text-primary-900">
                {question}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2">
            <RiDownloadLine />
            <span>Export Insights</span>
          </button>
        </div>
      </div>
    </div>
  );
}
