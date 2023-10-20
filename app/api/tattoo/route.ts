import { prisma } from "../prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

export type Tattoo = Omit<
  Prisma.TattooGetPayload<{}>,
  "proxyId" | "proxyChannel"
>;
async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const userId = session!.user!.id;
  const tattoos = await prisma.tattoo.findMany({
    where: { userId },
    take: 10,
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response.json({ data: { tattoos: tattoos } });
}

export { GET };
