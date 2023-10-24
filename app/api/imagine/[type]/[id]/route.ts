import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/app/api/prisma";
export type Imagine = Omit<Prisma.ImagineGetPayload<{}>, "proxyChannel">;
async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }
  const imageId = parseInt(params.id, 10);
  const userId = session!.user!.id;
  console.log({ userId, type: params.type });

  const imagine = await prisma.imagine.findFirstOrThrow({
    where: { userId, type: params.type, id: imageId },
  });
  return Response.json({ data: { imagine: imagine } });
}

export { GET };
