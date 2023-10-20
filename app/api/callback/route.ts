import { CallbackReq } from "@/midjourney/api";
import { prisma } from "../prisma";

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

export { POST };
