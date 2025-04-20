import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, firstMessage, modelUsed, answers } = await request.json();

    const chat = await prisma.chat.create({
      data: {
        title: title || "New Conversation",
        userId,
        messages: {
          create: [
            {
              content: firstMessage,
              role: "USER",
              modelUsed: modelUsed || "UNKNOWN",
            },
            ...(answers?.map(
              (answer: { content: string; modelUsed: string }) => ({
                content: answer.content,
                role: "BOT",
                modelUsed: answer.modelUsed,
              })
            ) || []),
          ],
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json(chat);
  } catch (error) {
    console.error("Error creating chat:", error);
    return NextResponse.json(
      { error: "Failed to create chat" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to view your chats" },
        { status: 401 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { messages: true },
        },
      },
    });

    const serializedChats = chats.map((chat) => ({
      id: chat.id,
      title: chat.title,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messageCount: chat._count.messages,
    }));

    return NextResponse.json(serializedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    return NextResponse.json(
      { error: "Failed to fetch chats" },
      { status: 500 }
    );
  }
}
