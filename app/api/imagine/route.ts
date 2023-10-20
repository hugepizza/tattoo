import { imagine } from "@/midjourney/api";
import { prisma } from "../prisma";
import AssemblePrompt, { PromptParam } from "./prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { GENERATE_CREDIT } from "@/app/constant";
import { Prisma } from "@prisma/client";

export type Imagine = Omit<
  Prisma.ImagineGetPayload<{}>,
  "proxyId" | "proxyChannel"
>;

async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) NextResponse.json({}, { status: 401 });
  const userId = session!.user!.id;
  const userCredit = await prisma.userCredit.findFirstOrThrow({
    where: { userId },
  });
  if (userCredit.credits < GENERATE_CREDIT)
    return NextResponse.json({ err: { msg: "out of credits" } });

  const param = (await request.json()) as PromptParam;
  const prompt = AssemblePrompt(param);
  const imagineRes = await imagine({ prompt, fast: false });
  const createDraft = prisma.imagine.create({
    data: {
      userId: userId,
      type: "draft",
      prompt: prompt,
      progress: "0%",
      status: "NOT_STARTED",
      credits: 1,
      rawPrompt: param.rawPrompt,
      style: param.style,
      proxyId: imagineRes.result,
      proxyChannel: imagineRes.properties?.discordInstanceId,
      actions: "IMAGINE",
    },
  });
  const updateUserCredit = prisma.userCredit.update({
    where: { userId },
    data: { credits: { decrement: GENERATE_CREDIT } },
  });
  await prisma.$transaction([createDraft, updateUserCredit]);
  return Response.json({});
}

export { POST };
