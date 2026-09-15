"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/clientAuth";

export async function cancelBooking(formData: FormData): Promise<void> {
  const client = await getCurrentClient();
  if (!client) {
    redirect("/cuenta/login");
  }

  const bookingId = String(formData.get("bookingId") ?? "");

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { slot: true },
  });

  if (!booking || booking.clientId !== client.id) {
    throw new Error("Cita no encontrada.");
  }
  if (booking.status !== "CONFIRMED" || booking.slot.startAt <= new Date()) {
    throw new Error("Esta cita ya no se puede cancelar.");
  }

  await prisma.booking.update({ where: { id: booking.id }, data: { status: "CANCELLED" } });

  revalidatePath("/cuenta/citas");
}
