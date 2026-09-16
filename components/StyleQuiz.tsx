"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import StyleCard from "./StyleCard";
import { HAIR_LENGTH_LEVELS, hairLengthRank } from "@/lib/hairLength";

type QuizStyle = {
  id: string;
  name: string;
  photoUrl: string;
  basePriceCents: number;
  durationMinutes: number;
  minHairLength: string;
  createdAt: string;
  isPopular: boolean;
  professionalName: string;
  categoryName: string;
};

type StyleQuizProps = {
  styles: QuizStyle[];
  categoryNames: string[];
};

const DURATION_OPTIONS = [
  { label: "Menos de 2h", test: (minutes: number) => minutes < 120 },
  { label: "Entre 2h y 4h", test: (minutes: number) => minutes >= 120 && minutes <= 240 },
  { label: "Más de 4h", test: (minutes: number) => minutes > 240 },
] as const;

const RESULT_COUNT = 3;

export default function StyleQuiz({ styles, categoryNames }: StyleQuizProps) {
  const [step, setStep] = useState(0);
  const [durationIndex, setDurationIndex] = useState<number | null>(null);
  const [hairRank, setHairRank] = useState<number | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const results = useMemo(() => {
    if (durationIndex === null || hairRank === null || category === null) return [];
    const durationTest = DURATION_OPTIONS[durationIndex].test;

    return styles
      .filter((style) => durationTest(style.durationMinutes))
      .filter((style) => {
        const requiredRank = hairLengthRank(style.minHairLength);
        return requiredRank === null || requiredRank <= hairRank;
      })
      .filter((style) => style.categoryName === category)
      .sort((a, b) => Number(b.isPopular) - Number(a.isPopular))
      .slice(0, RESULT_COUNT);
  }, [styles, durationIndex, hairRank, category]);

  function restart() {
    setStep(0);
    setDurationIndex(null);
    setHairRank(null);
    setCategory(null);
  }

  if (step === 3) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h2 className="font-serif text-xl font-semibold tracking-tight">Tu selección</h2>
          <p className="mt-1 text-sm text-ink/60">
            {results.length > 0
              ? "Estos estilos encajan con lo que buscas."
              : "Todavía no hay estilos publicados que encajen exactamente, pero puedes explorar el catálogo completo."}
          </p>
        </div>

        {results.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {results.map((style) => (
              <StyleCard
                key={style.id}
                id={style.id}
                name={style.name}
                photoUrl={style.photoUrl}
                basePriceCents={style.basePriceCents}
                durationMinutes={style.durationMinutes}
                minHairLength={style.minHairLength}
                createdAt={style.createdAt}
                isPopular={style.isPopular}
                professionalName={style.professionalName}
              />
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/catalogue"
            className="border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-paper hover:text-ink"
          >
            Ver todo el catálogo
          </Link>
          <button
            type="button"
            onClick={restart}
            className="text-sm text-clay underline underline-offset-4 hover:no-underline"
          >
            Volver a empezar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ink/50">Paso {step + 1} de 3</p>
        <h1 className="mt-2 font-serif text-2xl font-semibold tracking-tight">
          {step === 0 && "¿Cuánto tiempo tienes por delante?"}
          {step === 1 && "¿Cuál es tu longitud de pelo actual?"}
          {step === 2 && "¿Qué ambiente buscas?"}
        </h1>
      </div>

      {step === 0 && (
        <div className="flex flex-col gap-3">
          {DURATION_OPTIONS.map((option, index) => (
            <button
              key={option.label}
              type="button"
              onClick={() => {
                setDurationIndex(index);
                setStep(1);
              }}
              className="border border-line px-6 py-4 text-left text-sm font-medium transition hover:border-clay hover:text-clay"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex flex-col gap-3">
          {HAIR_LENGTH_LEVELS.map((level) => (
            <button
              key={level.rank}
              type="button"
              onClick={() => {
                setHairRank(level.rank);
                setStep(2);
              }}
              className="border border-line px-6 py-4 text-left text-sm font-medium transition hover:border-clay hover:text-clay"
            >
              {level.quizLabel}
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-3">
          {categoryNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                setCategory(name);
                setStep(3);
              }}
              className="border border-line px-6 py-4 text-left text-sm font-medium transition hover:border-clay hover:text-clay"
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="self-start text-sm text-ink/60 underline underline-offset-4 hover:text-ink"
        >
          ← Atrás
        </button>
      )}
    </div>
  );
}
