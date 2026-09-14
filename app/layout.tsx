import type { Metadata } from "next";
import { Fraunces, Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

const workSans = Work_Sans({ subsets: ["latin"], variable: "--font-sans" });
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-serif" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Trenzame — Reserva tu cita de trenzas",
  description: "Reserva tu cita de trenzas con profesionales verificadas en Barcelona.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${workSans.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 pb-24 sm:pb-10">{children}</main>
        <Footer />
        <BottomNav />
      </body>
    </html>
  );
}
