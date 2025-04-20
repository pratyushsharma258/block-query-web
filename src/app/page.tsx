"use server";

import { Suspense } from "react";
import ChatContainer from "@/components/chat-container";
import WelcomeScreen from "@/components/welcome-screen";
import ServerStatusError from "@/components/server-status-error";
import ServerStatusCheck from "@/components/server-status-check";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { JSX } from "react";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<JSX.Element> {
  const { userId } = await auth();
  const params = await searchParams;

  if (!userId) {
    return <WelcomeScreen />;
  }

  const currentChatId =
    typeof params.chatId === "string"
      ? params.chatId
      : Array.isArray(params.chatId)
      ? params.chatId[0]
      : null;

  const chats = await prisma.chat.findMany({
    where: { userId },
    include: { messages: true },
    orderBy: { updatedAt: "desc" },
  });

  const serializedChats = chats.map((chat) => ({
    id: chat.id,
    title: chat.title,
    createdAt: chat.createdAt.toISOString(),
    updatedAt: chat.updatedAt.toISOString(),
    userId: chat.userId,
    messages: chat.messages.map((message) => ({
      id: message.id,
      chatId: message.chatId,
      content: message.content,
      role: message.role,
      createdAt: message.createdAt.toISOString(),
      modelUsed: message.modelUsed || "UNKNOWN",
    })),
  }));

  return (
    <div className="w-full h-screen overflow-hidden flex flex-col bg-gradient-to-b from-gray-900 via-gray-950 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,rgba(168,85,247,0.15),transparent_50%)] pointer-events-none"></div>

      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute inset-0 
          bg-[linear-gradient(45deg,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.05)_1px,transparent_1px)] 
          bg-[size:40px_40px]"
        ></div>
      </div>

      <div className="relative w-full h-full flex-1 max-w-[2000px] mx-auto isolate z-10 overflow-auto flex flex-col items-center justify-center">
        <Suspense fallback={<div>Loading...</div>}>
          <ServerStatusCheck fallback={<ServerStatusError />}>
            <ChatContainer
              initialChats={serializedChats}
              currentChatId={currentChatId}
            />
          </ServerStatusCheck>
        </Suspense>
      </div>
    </div>
  );
}
