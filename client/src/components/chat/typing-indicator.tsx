import { RiMentalHealthLine } from "react-icons/ri";

export default function TypingIndicator() {
  return (
    <div className="flex mb-4 max-w-3xl mx-auto">
      <div className="flex-shrink-0 mr-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
          <RiMentalHealthLine className="text-primary-600 text-sm" />
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-t-xl rounded-br-xl py-3 px-4 shadow-sm max-w-[80%] md:max-w-[70%] flex items-center">
        <div className="dot-flashing"></div>
      </div>
    </div>
  );
}
