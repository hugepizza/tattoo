import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
export type Plan = Prisma.PlanGetPayload<{}>;
async function GET(request: NextRequest, response: NextResponse) {
  const plans = await prisma.plan.findMany({
    take: 10,
  });
  return Response.json({ data: { plans } });
}

export { GET };
