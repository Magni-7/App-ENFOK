import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StyleQuiz from "@/components/StyleQuiz";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Encuentra tu estilo — Trenzame",
};

export default async function QuizPage() {
  const styles = await prisma.style.findMany({
    where: { isActive: true },
    include: {
      photos: { orderBy: { order: "asc" }, take: 1 },
      professional: { select: { displayName: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const quizStyles = styles
    .filter((style) => style.photos[0])
    .map((style) => ({
      id: style.id,
      name: style.name,
      photoUrl: style.photos[0]!.url,
      basePriceCents: style.basePriceCents,
      durationMinutes: style.durationMinutes,
      minHairLength: style.minHairLength,
      createdAt: style.createdAt.toISOString(),
      isPopular: style.isPopular,
      professionalName: style.professional.displayName,
      categoryName: style.category.name,
    }));

  const categoryNames = Array.from(new Set(quizStyles.map((s) => s.categoryName)));

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-8">
      <Link href="/" className="text-sm text-ink/60 hover:text-ink">
        ← Volver al inicio
      </Link>

      {quizStyles.length === 0 || categoryNames.length === 0 ? (
        <div className="flex flex-col gap-4">
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Encuentra tu estilo</h1>
          <p className="text-sm text-ink/60">
            Todavía no hay suficientes estilos publicados para hacer el quiz. Mientras tanto, echa un
            vistazo al catálogo o a la galería.
          </p>
          <div className="flex gap-4">
            <Link href="/catalogue" className="text-sm text-clay underline underline-offset-4 hover:no-underline">
              Ver catálogo
            </Link>
            <Link href="/galeria" className="text-sm text-clay underline underline-offset-4 hover:no-underline">
              Ver galería
            </Link>
          </div>
        </div>
      ) : (
        <StyleQuiz styles={quizStyles} categoryNames={categoryNames} />
      )}
    </div>
  );
}
