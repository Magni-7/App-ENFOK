import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultProfessional } from "@/lib/professional";
import ContactButton from "@/components/ContactButton";

const LEGACY_PHOTO_COUNT = 27;

type LegadoPageProps = {
  params: Promise<{ index: string }>;
};

export const metadata: Metadata = {
  title: "Trabajo real — Trenzame",
};

export default async function LegadoPage({ params }: LegadoPageProps) {
  const { index: indexParam } = await params;
  const index = Number(indexParam);

  if (!Number.isInteger(index) || index < 1 || index > LEGACY_PHOTO_COUNT) {
    notFound();
  }

  const professional = await getDefaultProfessional();
  const photoUrl = `/images/gallery/eva/eva-${String(index).padStart(2, "0")}.jpg`;

  return (
    <div className="flex flex-col gap-8">
      <Link href="/galeria" className="text-sm text-ink/60 hover:text-ink">
        ← Volver a la galería
      </Link>

      <div className="relative aspect-[4/3] w-full overflow-hidden border border-line bg-ink">
        <Image
          src={photoUrl}
          alt="Trabajo de trenzas realizado por Eva"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>

      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Trabajo real</h1>
        <Link href="/" className="mt-2 inline-block text-sm text-ink/60 underline underline-offset-4 hover:text-ink">
          Hecho por {professional.displayName}
        </Link>
      </div>

      <dl className="grid grid-cols-1 gap-4 border-y border-line py-6 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Precio</dt>
          <dd className="mt-1 font-medium">Consulta con la profesional</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Duración</dt>
          <dd className="mt-1 font-medium">Consulta con la profesional</dd>
        </div>
        <div>
          <dt className="font-mono text-xs uppercase tracking-wide text-ink/50">Longitud de pelo</dt>
          <dd className="mt-1 font-medium">Consulta con la profesional</dd>
        </div>
      </dl>

      <div>
        <p className="mb-3 text-sm text-ink/70">
          Este trabajo todavía no tiene ficha de reserva. Pregunta directamente por precio, duración
          y disponibilidad:
        </p>
        <ContactButton
          whatsappNumber={professional.whatsappNumber}
          instagramUsername={professional.instagramDmUsername}
          message={`¡Hola ${professional.displayName}! Me interesa este trabajo que vi en la galería. ¿Podrías darme precio, duración y disponibilidad?`}
        />
      </div>
    </div>
  );
}
