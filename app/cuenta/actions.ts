"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/clientAuth";
import { CLIENT_COOKIE_NAME } from "@/lib/clientSession";
import { resizeImage } from "@/lib/image";

// Un avatar n'a jamais besoin d'être affiché plus grand que ça.
const AVATAR_MAX_WIDTH = 400;

export async function logoutClient(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(CLIENT_COOKIE_NAME);
  redirect("/");
}

export async function updateAvatar(formData: FormData): Promise<void> {
  const client = await getCurrentClient();
  if (!client) {
    redirect("/cuenta/login");
  }

  const photo = formData.get("avatar");
  if (!(photo instanceof File) || photo.size === 0) {
    throw new Error("Por favor selecciona una foto.");
  }

  const { buffer, contentType } = await resizeImage(photo, AVATAR_MAX_WIDTH);
  const blob = await put(`avatares/${client.id}-${Date.now()}.jpg`, buffer, {
    access: "public",
    addRandomSuffix: true,
    contentType,
  });

  await prisma.client.update({ where: { id: client.id }, data: { avatarUrl: blob.url } });

  revalidatePath("/cuenta");
  redirect("/cuenta");
}
