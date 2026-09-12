import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClientSessionCookieValue, CLIENT_COOKIE_NAME } from "@/lib/clientSession";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");
  const baseUrl = request.nextUrl.origin;

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/cuenta/login`);
  }

  const loginToken = await prisma.loginToken.findUnique({ where: { token } });

  const isValid = loginToken && !loginToken.usedAt && loginToken.expiresAt > new Date();

  if (!isValid) {
    return NextResponse.redirect(`${baseUrl}/cuenta/login?expirado=1`);
  }

  await prisma.loginToken.update({
    where: { id: loginToken.id },
    data: { usedAt: new Date() },
  });

  const response = NextResponse.redirect(`${baseUrl}/cuenta`);
  response.cookies.set(CLIENT_COOKIE_NAME, createClientSessionCookieValue(loginToken.clientId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  });

  return response;
}
