import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth/[...nextauth]/route";

export async function isAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) NextResponse.json({}, { status: 401 });
  return session!.user!.id;
}
