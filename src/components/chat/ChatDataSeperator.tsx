// components/common/chat/ChatDateSeparator.tsx

interface ChatDateSeparatorProps {
  date: string; // '2024.07.22 (월)' 같은 형식
}

const ChatDateSeparator = ({ date }: ChatDateSeparatorProps) => {
  return (
    <div className="flex justify-center body-sm-500 text-gray-700">{date}</div>
  );
};

export default ChatDateSeparator;
