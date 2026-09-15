"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import { formatDuration, formatPriceFrom } from "@/lib/format";

function formatPhoneDisplay(whatsappNumber: string): string {
  // Numéro stocké en format international sans espaces (ex. "34633779158").
  // Affiche juste le numéro national par groupes de 3 chiffres (633 77 91 58).
  const national = whatsappNumber.startsWith("34") ? whatsappNumber.slice(2) : whatsappNumber;
  return national.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-ink/60">
      <path
        d="M5 4h3.5l1.5 4-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4 1.5V18a2 2 0 0 1-2 2C10.5 20 4 13.5 4 6a2 2 0 0 1 1-2Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5 text-ink/60">
      <rect x="3" y="5" width="18" height="14" rx="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 6.5 12 13l8.5-6.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <rect x="3" y="3" width="18" height="18" rx="5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
      <path
        d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 8.5c0 4 3 7 7 7 .8 0 .8-1.8.3-2.3l-1.5-.7-1 1c-1-.5-2-1.5-2.5-2.5l1-1-.7-1.5c-.5-.5-2.3-.5-2.3.3.3-.3.3.7.3.7Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type StyleItem = {
  id: string;
  name: string;
  basePriceCents: number;
  durationMinutes: number;
  categoryName: string;
  photoUrl: string;
};

type ReviewItem = {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  styleName: string;
};

const reviewDateFormatter = new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "long", year: "numeric" });

type ProfessionalProfileTabsProps = {
  displayName: string;
  bio: string | null;
  rating: number;
  reviewCount: number;
  reviews: ReviewItem[];
  whatsappNumber: string | null;
  instagramHandle: string | null;
  address: string | null;
  email: string | null;
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
  reviewCount,
  reviews,
  whatsappNumber,
  instagramHandle,
  address,
  email,
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
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-3 py-4 text-center">
              <p className="font-serif text-3xl font-semibold">{rating.toFixed(1)}/5</p>
              <StarRating rating={rating} />
              <p className="text-sm text-ink/60">
                {reviewCount === 0
                  ? "Todavía no hay reseñas publicadas de clientas. ¡Sé la primera en reservar!"
                  : `${reviewCount} reseña${reviewCount === 1 ? "" : "s"}`}
              </p>
            </div>

            {reviews.length > 0 && (
              <div className="flex flex-col divide-y divide-line border-y border-line">
                {reviews.map((review) => (
                  <div key={review.id} className="flex flex-col gap-1 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <StarRating rating={review.rating} />
                      <span className="text-xs text-ink/50">
                        {reviewDateFormatter.format(new Date(review.createdAt))}
                      </span>
                    </div>
                    <p className="text-xs text-ink/50">{review.styleName}</p>
                    {review.comment && <p className="mt-1 text-sm text-ink/80">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
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
              <h3 className="mb-2 font-mono text-xs uppercase tracking-widest text-ink/60">Horario</h3>
              <p className="text-sm font-medium">{schedule}</p>
              {daysOffLabel && <p className="text-sm text-ink/60">Cerrado: {daysOffLabel}</p>}
            </div>

            <div>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/60">
                Información de la empresa
              </h3>
              <p className="mb-4 text-lg font-medium">{displayName}</p>

              <div className="flex flex-col divide-y divide-line border-y border-line text-sm">
                {whatsappNumber && (
                  <div className="flex items-center justify-between gap-4 py-4">
                    <div className="flex items-center gap-3">
                      <PhoneIcon />
                      <span className="font-medium">{formatPhoneDisplay(whatsappNumber)}</span>
                    </div>
                    <a
                      href={`tel:+${whatsappNumber}`}
                      className="shrink-0 rounded-full border border-line px-4 py-1.5 text-xs font-medium uppercase tracking-wide transition hover:border-ink"
                    >
                      Llamar
                    </a>
                  </div>
                )}
                {email && (
                  <div className="flex items-center gap-3 py-4">
                    <MailIcon />
                    <a href={`mailto:${email}`} className="font-medium underline underline-offset-4 hover:no-underline">
                      {email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-ink/60">
                Redes sociales y contacto
              </h3>
              <div className="flex items-center gap-4">
                {instagramProfileUrl && (
                  <a
                    href={instagramProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition hover:border-ink"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {whatsappNumber && (
                  <a
                    href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`¡Hola ${displayName}! Me gustaría más información.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-[#25D366] text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
                  >
                    <WhatsAppIcon />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
