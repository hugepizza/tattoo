import { getServerSession } from "next-auth";
import { prisma } from "../prisma";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

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
