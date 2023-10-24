import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../prisma";

async function GET(request: NextRequest, response: NextResponse) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  if (!userId) {
    return Response.json({});
  }
  const user = await prisma.user.findFirst({
    where: { id: userId },
    include: { UserCredit: true },
  });
  return Response.json(user);
}

export { GET };
