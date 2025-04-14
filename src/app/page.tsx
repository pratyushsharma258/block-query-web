import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { JSX } from "react";

export default async function Home(): Promise<JSX.Element> {
  const { userId } = await auth();
  const chats = userId
    ? await prisma.chat.findMany({
        where: {
          userId: userId,
        },
      })
    : [];

  return (
    <div
      className="w-auto bg-red-500 h-screen flex flex-col flex-grow items-center justify-center"
      id="main-div"
    >
      <div id="sidebar-div"></div>
      <div id="content-div"></div>
    </div>
  );
}
