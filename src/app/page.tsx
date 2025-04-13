import { PrismaClient } from "../../generated/prisma";

export default async function Home() {
  const prisma = new PrismaClient();

  await prisma.$connect();

  return (
    <div
      className="w-screen bg-blue-500 h-30 flex flex-col items-center justify-center"
      id="main-div"
    >
      <div></div>
    </div>
  );
}
