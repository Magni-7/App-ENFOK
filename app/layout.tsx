import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Eva Braids — Réservation de tresses",
  description: "Réservez votre rendez-vous tresses avec Eva à Barcelone.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col bg-white text-ink antialiased">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
