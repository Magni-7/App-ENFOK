import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getProfessionalRatingSummary } from "@/lib/reviews";
import StarRating from "@/components/StarRating";
import ProfessionalProfileTabs from "@/components/ProfessionalProfileTabs";

const WEEKDAY_LABELS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

function minutesToHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

type ProfessionalPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProfessionalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const professional = await prisma.professional.findUnique({ where: { slug } });
  return { title: professional ? `${professional.displayName} — Trenzame` : "Trenzame" };
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { slug } = await params;

  const professional = await prisma.professional.findUnique({
    where: { slug },
    include: {
      salons: { orderBy: { order: "asc" } },
      styles: {
        where: { isActive: true },
        include: { category: true, photos: { orderBy: { order: "asc" }, take: 1 } },
        orderBy: [{ categoryId: "asc" }, { order: "asc" }],
      },
    },
  });

  if (!professional) {
    notFound();
  }

  const [ratingSummary, reviews] = await Promise.all([
    getProfessionalRatingSummary(professional.id),
    prisma.review.findMany({
      where: { professionalId: professional.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: { booking: { include: { style: true } } },
    }),
  ]);

  const mainSalon = professional.salons[0];

  const styles = professional.styles
    .filter((style) => style.photos[0])
    .map((style) => ({
      id: style.id,
      name: style.name,
      basePriceCents: style.basePriceCents,
      durationMinutes: style.durationMinutes,
      categoryName: style.category.name,
      photoUrl: style.photos[0]!.url,
    }));

  const schedule = `${minutesToHHMM(professional.workDayStartMinutes)} - ${minutesToHHMM(professional.workDayEndMinutes)}`;
  const daysOffLabel =
    professional.daysOff.length > 0
      ? professional.daysOff.map((d) => WEEKDAY_LABELS[d]).join(", ")
      : null;

  return (
    <div className="flex flex-col gap-6">
      {mainSalon && (
        <div className="relative aspect-[16/9] w-full overflow-hidden border border-line bg-ink">
          <Image src={mainSalon.photoUrl} alt={mainSalon.name} fill className="object-cover" sizes="100vw" priority />
        </div>
      )}

      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">{professional.displayName}</h1>
        {mainSalon?.address && <p className="mt-1 text-sm text-ink/60">{mainSalon.address}</p>}
        <StarRating rating={ratingSummary.average} count={ratingSummary.count} className="mt-2" />
      </div>

      <ProfessionalProfileTabs
        displayName={professional.displayName}
        bio={professional.bio}
        rating={ratingSummary.average}
        reviewCount={ratingSummary.count}
        reviews={reviews.map((review) => ({
          id: review.id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt.toISOString(),
          styleName: review.booking.style.name,
        }))}
        whatsappNumber={professional.whatsappNumber}
        instagramHandle={professional.instagramHandle}
        address={mainSalon?.address ?? null}
        email={professional.email}
        schedule={schedule}
        daysOffLabel={daysOffLabel}
        styles={styles}
      />
    </div>
  );
}
