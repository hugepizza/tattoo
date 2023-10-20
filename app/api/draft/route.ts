import { imagine } from "@/midjourney/api";
import { prisma } from "../prisma";
import AssemblePrompt, { PromptParam } from "./prompt";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";
import { GenerateCredit } from "@/app/constant";
import { Prisma } from "@prisma/client";

async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) NextResponse.json({}, { status: 401 });
  const userId = session!.user!.id;
  const userCredit = await prisma.userCredit.findFirstOrThrow({
    where: { userId },
  });
  if (userCredit.credits < GenerateCredit)
    return NextResponse.json({ err: { msg: "out of credits" } });

  const param = (await request.json()) as PromptParam;
  const prompt = AssemblePrompt(param);
  const imagineRes = await imagine({ prompt, fast: false });
  const createDraft = prisma.draft.create({
    data: {
      userId: userId,
      prompt: prompt,
      progress: "0%",
      status: "NOT_STARTED",
      credits: 1,
      rawPrompt: param.rawPrompt,
      position: param.position,
      style: param.style,
      proxyId: imagineRes.result,
      proxyChannel: imagineRes.properties?.discordInstanceId,
      actions: "IMAGINE",
    },
  });
  const updateUserCredit = prisma.userCredit.update({
    where: { userId },
    data: { credits: { decrement: GenerateCredit } },
  });
  await prisma.$transaction([createDraft, updateUserCredit]);
  return Response.json({});
}
export type Draft = Omit<
  Prisma.DraftGetPayload<{}>,
  "proxyId" | "proxyChannel"
>;
async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({}, { status: 401 });
  }

  const userId = session!.user!.id;
  const drafts = await prisma.draft.findMany({
    where: { userId },
    take: 10,
    skip: 0,
    orderBy: {
      createdAt: "desc",
    },
  });
  return Response.json({ data: { drafts: drafts } });
}

export { POST, GET };
