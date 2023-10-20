import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/app/api/prisma";
import { VarufyCredit } from "@/app/constant";
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
  if (userCredit.credits < VarufyCredit) {
    return NextResponse.json({ err: { msg: "out of credits" } });
  }
  const { label, customId, draftId } = await request.json();
  const draft = await prisma.draft.findFirst({ where: { id: draftId } });
  if (!draft?.buttons) {
    return NextResponse.json({}, { status: 400 });
  }
  const buttons = draft.buttons as Button[];
  const index = buttons.findIndex(
    (ele) => ele.customId === customId && ele.label === label && !ele.used
  );
  if (index === -1) {
    return NextResponse.json({}, { status: 400 });
  }

  const actionRes = await action({ taskId: draft.proxyId, customId });

  const txPromise = [];
  (draft.buttons as Button[])[index].used = true;
  txPromise.push(
    prisma.draft.update({
      where: { id: draftId },
      data: {
        buttons: draft.buttons,
      },
    })
  );
  if (label.startsWith("U")) {
  } else if (label.startsWith("V")) {
    txPromise.push(
      prisma.draft.create({
        data: {
          userId: userId,
          prompt: draft.prompt,
          progress: "0%",
          status: "NOT_STARTED",
          credits: 1,
          rawPrompt: draft.rawPrompt,
          position: draft.position,
          style: draft.style,
          proxyId: actionRes.result,
          actions: "VARIATION",
        },
      }),
      prisma.userCredit.update({
        where: { userId },
        data: { credits: { decrement: VarufyCredit } },
      })
    );
  }
  await prisma.$transaction(txPromise);
  return Response.json({});
}

export { POST };
