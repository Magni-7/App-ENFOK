import { headers } from "next/headers";
import QRCode from "qrcode";
import { requireProfessional } from "@/lib/professional";

// Génère à la volée le QR code pointant vers la page publique du professionnel
// connecté (/profesionales/[slug]), pour qu'il puisse l'imprimer ou le
// partager (salon, réseaux, cartes de visite).
export async function GET() {
  const professional = await requireProfessional();

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const protocol = host.startsWith("localhost") ? "http" : "https";
  const profileUrl = `${protocol}://${host}/profesionales/${professional.slug}`;

  const buffer = await QRCode.toBuffer(profileUrl, {
    width: 800,
    margin: 2,
    color: { dark: "#1a1a1a", light: "#ffffff" },
  });

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="qr-${professional.slug}.png"`,
    },
  });
}
