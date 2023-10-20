import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/api/prisma";
import { UPSCALE_CREDIT, VARIATION_CREDIT } from "@/app/constant";
import { action } from "@/midjourney/api";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export type Button = { customId: string; label: string; used?: boolean };
async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({}, { status: 401 });
  const userId = session!.user!.id;
  const userCredit = await prisma.userCredit.findFirstOrThrow({
    where: { userId },
  });
  if (userCredit.credits < VARIATION_CREDIT) {
    return NextResponse.json({ err: { msg: "out of credits" } });
  }
  const { label, customId, imagineId } = await request.json();
  const imagine = await prisma.imagine.findFirst({ where: { id: imagineId } });
  if (!imagine?.buttons) {
    return NextResponse.json({}, { status: 400 });
  }
  const buttons = imagine.buttons as Button[];
  const index = buttons.findIndex(
    (ele) => ele.customId === customId && ele.label === label && !ele.used
  );
  if (index === -1) {
    return NextResponse.json({}, { status: 400 });
  }

  const actionRes = await action({ taskId: imagine.proxyId, customId });

  const txPromise = [];
  (imagine.buttons as Button[])[index].used = true;
  txPromise.push(
    prisma.imagine.update({
      where: { id: imagineId },
      data: {
        buttons: imagine.buttons,
      },
    })
  );
  if (label.startsWith("U")) {
    txPromise.push(
      prisma.imagine.create({
        data: {
          userId: userId,
          parentImagineId: imagine.id,
          type: "tattoo",
          progress: "0%",
          status: "NOT_STARTED",
          proxyId: actionRes.result,
          rawPrompt: imagine.rawPrompt,
          prompt: label,
          style: imagine.style,
          credits: UPSCALE_CREDIT,
          actions: "UPSCALE",
        },
      })
    );
  } else if (label.startsWith("V")) {
    txPromise.push(
      prisma.imagine.create({
        data: {
          userId: userId,
          parentImagineId: imagine.id,
          type: "draft",
          prompt: label,
          progress: "0%",
          status: "NOT_STARTED",
          credits: VARIATION_CREDIT,
          rawPrompt: imagine.rawPrompt,
          style: imagine.style,
          proxyId: actionRes.result,
          actions: "VARIATION",
        },
      }),
      prisma.userCredit.update({
        where: { userId },
        data: { credits: { decrement: VARIATION_CREDIT } },
      })
    );
  }
  await prisma.$transaction(txPromise);
  return Response.json({});
}

export { POST };
