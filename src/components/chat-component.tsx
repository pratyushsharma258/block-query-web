"use client";

import { JSX, useEffect, useRef } from "react";
import { format, parseISO } from "date-fns";

interface SerializedMessage {
  id: number;
  chatId: number;
  content: string;
  role: string;
  createdAt: string;
  modelUsed: string;
}

interface SerializedChat {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  messages: SerializedMessage[];
}

interface ChatComponentProps {
  chats: SerializedChat[];
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
        <div className="p-6 bg-gray-800/70 backdrop-blur-md rounded-lg border border-gray-700/30 shadow-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 mb-3 rounded-full bg-blue-900/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Chat Not Found
            </h2>
            <p className="text-gray-400 text-sm">
              The requested conversation could not be located
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Reduced size header */}
      <div className="sticky top-0 z-10 backdrop-blur-md bg-inherit py-3 px-4 border-b border-gray-800/30 shadow-md">
        <div className="text-center max-w-5xl mx-auto">
          <h2 className="text-xl font-medium mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            {currentChat.title}
          </h2>
          <div className="flex justify-center items-center gap-2 text-xs text-gray-500">
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {format(parseISO(currentChat.createdAt), "MMM dd, yyyy")}
            </span>
            <span className="text-gray-600">•</span>
            <span className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 mr-1 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {format(parseISO(currentChat.updatedAt), "MMM dd, yyyy")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto px-2 py-4 messages-container w-full">
        <div
          className="flex flex-col gap-6 mb-4 w-full mx-auto"
          style={{ maxWidth: "85%" }}
        >
          {currentChat.messages.map((message) => {
            const isUser = message.role.toUpperCase() === "USER";
            return (
              <div
                key={`msg-${message.id}`}
                className={`flex ${
                  isUser ? "justify-end" : "justify-start"
                } group w-full`}
              >
                <div
                  className={`max-w-[80%] shadow-sm transition-all duration-200 group-hover:shadow-md ${
                    isUser
                      ? "bg-blue-600/90 text-white rounded-tr-none rounded-bl-xl rounded-br-2xl rounded-tl-2xl"
                      : "bg-gray-800/90 text-white rounded-tl-none rounded-bl-2xl rounded-br-xl rounded-tr-2xl border border-gray-700/30"
                  } overflow-hidden transform group-hover:scale-[1.005] transition-transform`}
                >
                  <div className="p-4">
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">
                      {message.content}
                    </p>
                  </div>

                  <div
                    className={`flex justify-between items-center px-3 py-1.5 text-[10px] backdrop-blur-sm
                    ${
                      isUser
                        ? "bg-blue-700/70 text-blue-100"
                        : "bg-gray-900/50 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      {!isUser && (
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 mr-1"></div>
                      )}
                      <span className="font-medium">
                        {isUser ? "You" : message.modelUsed}
                      </span>
                    </div>
                    <time className="opacity-70">
                      {format(parseISO(message.createdAt), "h:mm a")}
                    </time>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}
