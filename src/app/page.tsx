"use server";

import ChatComponent from "@/components/chat-component";
import ChatInput from "@/components/chat-input";
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

  const currentChatId =
    typeof params.chatId === "string"
      ? params.chatId
      : Array.isArray(params.chatId)
      ? params.chatId[0]
      : null;

  console.log("userId", userId);
  console.log("params", params);
  console.log("currentChatId", currentChatId);

  // const chats = userId
  //   ? await prisma.chat.findMany({
  //       where: { userId },
  //       include: { messages: true }, // Include messages with each chat
  //     })
  //   : [];

  const dummyChats = [
    {
      id: 1,
      title: "Blockchain Fundamentals",
      createdAt: new Date("2025-04-10T15:30:00Z"),
      updatedAt: new Date("2025-04-10T16:45:00Z"),
      userId: "user_2a8b4c6d8e0f2g4h6i8j0k2l",
      messages: [
        {
          id: 1,
          chatId: 1,
          content: "Hello there! I have a question about blockchain.",
          role: "USER",
          createdAt: new Date("2025-04-10T15:30:00Z"),
          modelUsed: "BART",
        },
        {
          id: 2,
          chatId: 1,
          content:
            "Sure! I'd be happy to help. What would you like to know about blockchain?",
          role: "BOT",
          createdAt: new Date("2025-04-10T15:30:15Z"),
          modelUsed: "GPT-4",
        },
        {
          id: 3,
          chatId: 1,
          content:
            "What's the difference between proof-of-work and proof-of-stake?",
          role: "USER",
          createdAt: new Date("2025-04-10T15:31:00Z"),
          modelUsed: "BART",
        },
        {
          id: 4,
          chatId: 1,
          content:
            "Proof-of-Work (PoW) requires miners to solve complex mathematical puzzles, consuming significant energy. Proof-of-Stake (PoS) selects validators based on the number of coins they're willing to 'stake' or lock up as collateral, making it more energy-efficient. PoS also typically offers faster transaction times and lower fees.",
          role: "BOT",
          createdAt: new Date("2025-04-10T15:31:30Z"),
          modelUsed: "CLAUDE",
        },
      ],
    },
    {
      id: 2,
      title: "Smart Contracts Explained",
      createdAt: new Date("2025-04-11T09:15:00Z"),
      updatedAt: new Date("2025-04-11T10:30:00Z"),
      userId: "user_2a8b4c6d8e0f2g4h6i8j0k2l",
      messages: [
        {
          id: 5,
          chatId: 2,
          content: "How do smart contracts work?",
          role: "USER",
          createdAt: new Date("2025-04-11T09:15:00Z"),
          modelUsed: "BART",
        },
        {
          id: 6,
          chatId: 2,
          content:
            "Smart contracts are self-executing programs stored on a blockchain that run when predetermined conditions are met. They automatically enforce and execute the terms of an agreement. For example, on Ethereum, they're written in Solidity and execute exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference.",
          role: "BOT",
          createdAt: new Date("2025-04-11T09:15:45Z"),
          modelUsed: "GPT-4",
        },
        {
          id: 7,
          chatId: 2,
          content: "Can smart contracts interact with real-world data?",
          role: "USER",
          createdAt: new Date("2025-04-11T09:20:00Z"),
          modelUsed: "BART",
        },
        {
          id: 8,
          chatId: 2,
          content:
            "Yes, through oracles. Oracles are third-party services that provide smart contracts with external information. They act as bridges between blockchains and the outside world, allowing smart contracts to execute based on real-world inputs and events like price feeds, weather data, or payment confirmations.",
          role: "BOT",
          createdAt: new Date("2025-04-11T09:21:10Z"),
          modelUsed: "GEMINI",
        },
      ],
    },
    {
      id: 3,
      title: "DeFi Exploration",
      createdAt: new Date("2025-04-12T14:00:00Z"),
      updatedAt: new Date("2025-04-12T14:15:00Z"),
      userId: "user_2a8b4c6d8e0f2g4h6i8j0k2l",
      messages: [
        {
          id: 9,
          chatId: 3,
          content: "What is DeFi and why is it important?",
          role: "USER",
          createdAt: new Date("2025-04-12T14:00:00Z"),
          modelUsed: "BART",
        },
        {
          id: 10,
          chatId: 3,
          content:
            "DeFi (Decentralized Finance) refers to financial services built on blockchain technology that operate without centralized authorities like banks. It's important because it offers financial inclusion, transparency, programmable money, and removes intermediaries. DeFi applications include lending platforms, decentralized exchanges, and yield farming protocols.",
          role: "BOT",
          createdAt: new Date("2025-04-12T14:01:30Z"),
          modelUsed: "CLAUDE",
        },
      ],
    },
  ];

  return (
    <div className="w-full h-full flex flex-col bg-gray-900" id="main-div">
      <div className="flex-grow overflow-y-auto">
        {currentChatId ? (
          <ChatComponent
            key={currentChatId}
            chats={dummyChats}
            currentChatId={currentChatId}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold text-white">
              Welcome to Block Query
            </h1>
            <p className="text-white">Start a new conversation...</p>
          </div>
        )}
      </div>
      <div className="w-full flex justify-center py-4">
        <ChatInput />
      </div>
    </div>
  );
}
