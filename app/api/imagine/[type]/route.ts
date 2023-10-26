import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "../../prisma";

export type Imagine = Omit<Prisma.ImagineGetPayload<{}>, "proxyChannel">;
async function GET(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  const searchParams = request.nextUrl.searchParams;
  const pageStr = searchParams.get("page") || "a";
  const page = isNaN(parseInt(pageStr, 10)) ? 1 : parseInt(pageStr, 10);
  const pageSize = 3;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }
  const userId = session!.user!.id;
  console.log({ userId, type: params.type });

  const imagine = await prisma.imagine.findMany({
    where: { userId, type: params.type },
    take: pageSize,
    skip: (page - 1) * pageSize,
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response.json({ data: { imagine: imagine } });
}

export { GET };
