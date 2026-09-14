"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import ContactButton from "./ContactButton";
import { formatDuration, formatPriceFrom } from "@/lib/format";

type StyleItem = {
  id: string;
  name: string;
  basePriceCents: number;
  durationMinutes: number;
  categoryName: string;
  photoUrl: string;
};

type ProfessionalProfileTabsProps = {
  displayName: string;
  bio: string | null;
  rating: number;
  whatsappNumber: string | null;
  instagramHandle: string | null;
  instagramDmUsername: string | null;
  address: string | null;
  schedule: string;
  daysOffLabel: string | null;
  styles: StyleItem[];
};

const TABS = ["Prestaciones", "Reseñas", "Galería", "Información"] as const;
type Tab = (typeof TABS)[number];

export default function ProfessionalProfileTabs({
  displayName,
  bio,
  rating,
  whatsappNumber,
  instagramHandle,
  instagramDmUsername,
  address,
  schedule,
  daysOffLabel,
  styles,
}: ProfessionalProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Prestaciones");

  const categories = Array.from(new Set(styles.map((s) => s.categoryName)));
  const instagramProfileUrl = instagramHandle ? `https://instagram.com/${instagramHandle}` : null;
  const mapSrc = address ? `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed` : null;

  return (
    <div>
      <nav className="flex gap-6 border-b border-line text-sm font-medium uppercase tracking-wide">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 py-3 transition ${
              activeTab === tab ? "border-clay text-ink" : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="py-6">
        {activeTab === "Prestaciones" && (
          <div className="flex flex-col gap-8">
            {styles.length === 0 ? (
              <p className="text-sm text-ink/60">Todavía no hay prestaciones publicadas.</p>
            ) : (
              categories.map((categoryName) => (
                <div key={categoryName}>
                  <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/60">{categoryName}</h3>
                  <div className="flex flex-col divide-y divide-line border-y border-line">
                    {styles
                      .filter((s) => s.categoryName === categoryName)
                      .map((style) => (
                        <div key={style.id} className="flex items-center justify-between gap-4 py-4">
                          <div>
                            <p className="font-medium">{style.name}</p>
                            <p className="mt-1 font-mono text-xs text-ink/60">
                              {formatPriceFrom(style.basePriceCents)} · {formatDuration(style.durationMinutes)}
                            </p>
                          </div>
                          <Link
                            href={`/reserver/${style.id}`}
                            className="shrink-0 border border-ink bg-ink px-4 py-2 text-xs font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
                          >
                            Reservar
                          </Link>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "Reseñas" && (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <p className="font-serif text-3xl font-semibold">{rating.toFixed(1)}/5</p>
            <StarRating rating={rating} />
            <p className="mt-2 max-w-sm text-sm text-ink/60">
              Todavía no hay reseñas publicadas de clientas. ¡Sé la primera en reservar!
            </p>
          </div>
        )}

        {activeTab === "Galería" && (
          <div>
            {styles.length === 0 ? (
              <p className="text-sm text-ink/60">Todavía no hay fotos publicadas.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {styles.map((style) => (
                  <Link
                    key={style.id}
                    href={`/styles/${style.id}`}
                    className="group relative block aspect-square overflow-hidden border border-line"
                  >
                    <Image
                      src={style.photoUrl}
                      alt={style.name}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                      sizes="(min-width: 640px) 33vw, 50vw"
                    />
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "Información" && (
          <div className="flex flex-col gap-8">
            {mapSrc && (
              <div className="aspect-video w-full overflow-hidden border border-line">
                <iframe
                  src={mapSrc}
                  className="h-full w-full border-0"
                  loading="lazy"
                  title={`Ubicación de ${displayName}`}
                />
              </div>
            )}

            {bio && (
              <div>
                <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/60">Sobre nosotros</h3>
                <p className="text-sm text-ink/80">{bio}</p>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/60">
                Contacto y horario
              </h3>
              <dl className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-ink/50">Dirección</dt>
                  <dd className="mt-1 font-medium">{address ?? "Próximamente"}</dd>
                </div>
                <div>
                  <dt className="text-ink/50">Horario</dt>
                  <dd className="mt-1 font-medium">
                    {schedule}
                    {daysOffLabel && <span className="block text-ink/60">Cerrado: {daysOffLabel}</span>}
                  </dd>
                </div>
                {whatsappNumber && (
                  <div>
                    <dt className="text-ink/50">Teléfono</dt>
                    <dd className="mt-1">
                      <a href={`tel:+${whatsappNumber}`} className="font-medium underline underline-offset-4">
                        +{whatsappNumber}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="flex flex-col gap-3">
              <ContactButton
                whatsappNumber={whatsappNumber}
                instagramUsername={instagramDmUsername}
                message={`¡Hola ${displayName}! Me gustaría más información.`}
              />
              {instagramProfileUrl && (
                <a
                  href={instagramProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink underline underline-offset-4 hover:no-underline"
                >
                  Ver perfil de Instagram (@{instagramHandle})
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
