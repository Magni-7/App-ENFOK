import { prisma } from "@/lib/prisma";

export type RatingSummary = { average: number; count: number };

export async function getProfessionalRatingSummary(professionalId: string): Promise<RatingSummary> {
  const result = await prisma.review.aggregate({
    where: { professionalId },
    _avg: { rating: true },
    _count: true,
  });

  return { average: result._avg.rating ?? 0, count: result._count };
}
