"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { CLIENT_COOKIE_NAME } from "@/lib/clientSession";

export async function logoutClient(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_COOKIE_NAME);
  redirect("/");
}
