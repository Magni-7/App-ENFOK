import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentClient } from "@/lib/clientAuth";
import StarRating from "@/components/StarRating";

export const metadata: Metadata = {
  title: "Mis reseñas — Trenzame",
};

const dateFormatter = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

export default async function MisResenasPage() {
  const client = await getCurrentClient();
  if (!client) {
    redirect("/cuenta/login");
  }

  const reviews = await prisma.review.findMany({
    where: { booking: { clientId: client.id } },
    include: { booking: { include: { style: true, professional: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-8">
      <div>
        <Link href="/cuenta" className="text-sm text-ink/60 hover:text-ink">
          ← Volver a mi perfil
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">Mis reseñas</h1>
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-ink/60">
          Todavía no has dejado ninguna reseña. Aparecerán aquí después de tus citas.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-line border-y border-line">
          {reviews.map((review) => (
            <div key={review.id} className="flex flex-col gap-1 py-4">
              <div className="flex items-center justify-between gap-4">
                <p className="font-medium">{review.booking.style.name}</p>
                <span className="text-xs text-ink/50">{dateFormatter.format(review.createdAt)}</span>
              </div>
              <p className="text-xs text-ink/50">{review.booking.professional.displayName}</p>
              <StarRating rating={review.rating} className="mt-1" />
              {review.comment && <p className="mt-1 text-sm text-ink/80">{review.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
