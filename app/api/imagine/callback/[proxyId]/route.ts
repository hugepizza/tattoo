import { CallbackReq, getTask } from "@/midjourney/api";
import prisma from "../../../prisma";
import { NextRequest, NextResponse } from "next/server";

async function POST(request: Request) {
  const data = (await request.json()) as CallbackReq;
  console.log("mj proxy callback", data);
  const update: any = { status: data.status };
  switch (data.status) {
    case "FAILURE":
      update.errorMessage = data.failReason;
    case "SUCCESS":
      update.imageUrl = data.imageUrl;
      update.progress = "100%";
      update.buttons = data.buttons;
      break;
    case "IN_PROGRESS":
      update.progress = data.progress;
      update.imageUrl = data.imageUrl;
      break;
    default:
  }
  await prisma.imagine.update({
    where: { proxyId: data.id },
    data: update,
  });
  return Response.json({});
}

async function GET(
  request: NextRequest,
  { params }: { params: { proxyId: string } }
) {
  const where = { proxyId: params.proxyId };
  const callback = await getTask(params.proxyId);
  const target = await prisma.imagine.findFirstOrThrow({
    where,
  });
  let mutation = false;
  let done = false;
  if (target.status === "SUCCESS" || target.status === "FAILURE") {
    return NextResponse.json({ mutation });
  }
  if (
    callback.status === "IN_PROGRESS" &&
    callback.progress != target.progress
  ) {
    await prisma.imagine.update({
      where,
      data: {
        status: callback.status,
        progress: callback.progress,
      },
    });
    mutation = true;
  } else if (callback.status === "FAILURE") {
    await prisma.imagine.update({
      where,
      data: {
        status: callback.status,
        errorMessage: callback.failReason,
      },
    });
    mutation = true;
    done = true;
  } else if (callback.status === "SUCCESS") {
    await prisma.imagine.update({
      where,
      data: {
        status: callback.status,
        imageUrl: callback.imageUrl,
        buttons: callback.buttons,
      },
    });
    mutation = true;
    done = true;
  }
  return NextResponse.json({ mutation, type: target.type, done });
}
export { POST, GET };
