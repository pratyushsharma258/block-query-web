"use client";
import { JSX, useEffect, useRef } from "react";
import { format } from "date-fns";

interface Message {
  id: number;
  chatId: number;
  content: string;
  role: string;
  createdAt: Date;
  modelUsed: string;
}

interface Chat {
  id: number;
  title: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

interface ChatComponentProps {
  chats: Chat[];
  currentChatId: string | null;
}

export default function ChatComponent({
  chats,
  currentChatId,
}: ChatComponentProps): JSX.Element {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentChat = chats.find(
    (chat) => chat.id.toString() === currentChatId
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat?.messages]);

  if (!currentChat) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <div className="p-8 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Chat Not Found</h2>
          <p>The requested chat could not be located</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full max-w-4xl mx-auto flex flex-col p-4 overflow-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-1 text-white">
          {currentChat.title}
        </h2>
        <div className="flex justify-center items-center gap-2 text-sm text-gray-400">
          <span>
            Created: {format(new Date(currentChat.createdAt), "MMM dd, yyyy")}
          </span>
          <span>•</span>
          <span>
            Last updated:{" "}
            {format(new Date(currentChat.updatedAt), "MMM dd, yyyy")}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-6 mb-4">
        {currentChat.messages.map((message) => {
          const isUser = message.role.toUpperCase() === "USER";
          return (
            <div
              key={message.id}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] ${
                  isUser
                    ? "bg-blue-600 text-white rounded-tr-none rounded-bl-2xl rounded-br-2xl rounded-tl-2xl"
                    : "bg-gray-800 text-white rounded-tl-none rounded-bl-2xl rounded-br-2xl rounded-tr-2xl border border-gray-700"
                } overflow-hidden`}
              >
                <div className="p-4">
                  <p className="whitespace-pre-wrap">{message.content}</p>
                </div>

                <div
                  className={`flex justify-between items-center px-3 py-1.5 text-xs 
                    ${
                      isUser
                        ? "bg-blue-700 text-blue-200"
                        : "bg-gray-900 text-gray-400"
                    }`}
                >
                  <div className="flex items-center gap-1">
                    <span className="font-medium">
                      {isUser ? "You" : message.modelUsed}
                    </span>
                  </div>
                  <time className="text-xs">
                    {format(new Date(message.createdAt), "MMM dd, h:mm a")}
                  </time>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
