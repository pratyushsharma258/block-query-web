import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ chatId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const chatIdStr = resolvedParams.chatId;
    const chatId = parseInt(chatIdStr);

    if (isNaN(chatId)) {
      return NextResponse.json({ error: "Invalid chat ID" }, { status: 400 });
    }

    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        userId,
      },
    });

    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    const { userMessage, botResponses } = await request.json();

    const messagesToCreate = [
      {
        chatId,
        content: userMessage.content,
        role: "USER",
        modelUsed: userMessage.modelUsed || "UNKNOWN",
      },
      ...(botResponses?.map(
        (response: { content: string; modelUsed: string }) => ({
          chatId,
          content: response.content,
          role: "BOT",
          modelUsed: response.modelUsed,
        })
      ) || []),
    ];

    const result = await prisma.$transaction(
      messagesToCreate.map((msg) =>
        prisma.message.create({
          data: msg,
        })
      )
    );

    await prisma.chat.update({
      where: { id: chatId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ messages: result });
  } catch (error) {
    console.error("Error adding messages:", error);
    return NextResponse.json(
      { error: "Failed to add messages" },
      { status: 500 }
    );
  }
}
