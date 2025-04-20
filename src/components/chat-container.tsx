"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ChatComponent from "@/components/chat-component";
import ChatInput from "@/components/chat-input";

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

interface ChatContainerProps {
  initialChats: SerializedChat[];
  currentChatId: string | null;
}

export default function ChatContainer({
  initialChats,
  currentChatId,
}: ChatContainerProps) {
  const router = useRouter();
  const [chats, setChats] = useState<SerializedChat[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setChats(initialChats);
    setIsClient(true);
  }, [initialChats]);

  const handleMessageSent = useCallback(
    (message: string, modelUsed: string) => {
      if (!currentChatId) return;

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id.toString() === currentChatId) {
            const now = new Date();
            const uniqueId = now.getTime() * 1000 + now.getMilliseconds();

            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: uniqueId, // Use a more unique ID to avoid duplicate keys
                  chatId: chat.id,
                  content: message,
                  role: "USER",
                  createdAt: now.toISOString(),
                  modelUsed: modelUsed,
                },
              ],
            };
          }
          return chat;
        })
      );
    },
    [currentChatId]
  );

  const handleResponseReceived = useCallback(
    (content: string, modelUsed: string) => {
      if (!currentChatId) return;

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id.toString() === currentChatId) {
            const now = new Date();
            const uniqueId =
              now.getTime() * 1000 + Math.floor(Math.random() * 1000);

            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  id: uniqueId,
                  chatId: chat.id,
                  content: content,
                  role: "BOT",
                  createdAt: now.toISOString(),
                  modelUsed: modelUsed,
                },
              ],
            };
          }
          return chat;
        })
      );
    },
    [currentChatId]
  );

  const handleNewChatCreated = useCallback((chatId: string) => {
    console.log("New chat created:", chatId);
  }, []);

  return (
    <>
      <div className="flex-grow overflow-y-auto">
        {isClient ? (
          currentChatId ? (
            <ChatComponent
              key={`chat-${currentChatId}`}
              chats={chats}
              currentChatId={currentChatId}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <h1 className="text-2xl font-bold text-white">
                Welcome to Block Query
              </h1>
              <p className="text-white">
                Ask a question to start a new conversation
              </p>
            </div>
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-white">Loading chat...</p>
          </div>
        )}
      </div>

      {isClient && (
        <div className="w-full flex justify-center py-4">
          <ChatInput
            onMessageSent={handleMessageSent}
            onResponseReceived={handleResponseReceived}
            onNewChatCreated={handleNewChatCreated}
            currentChatId={currentChatId}
            placeholder="Ask a blockchain question..."
          />
        </div>
      )}
    </>
  );
}
