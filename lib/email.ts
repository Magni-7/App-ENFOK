import { Resend } from "resend";

// Domaine d'envoi : par défaut le domaine de test de Resend, qui ne délivre
// qu'à l'adresse du compte Resend lui-même. Pour envoyer à de vraies
// clientes, il faut vérifier un domaine (ex. trenzame.com) sur resend.com
// et définir RESEND_FROM_EMAIL avec une adresse de ce domaine.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Trenzame <onboarding@resend.dev>";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY n'est pas défini (voir .env.example).");
  }
  return new Resend(apiKey);
}

type SendWelcomeEmailParams = {
  to: string;
};

export async function sendWelcomeEmail({ to }: SendWelcomeEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <p>¡Bienvenida a Trenzame! Tu cuenta acaba de crearse.</p>
      <p>Desde aquí podrás ver tus próximas citas y tu historial de reservas.</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, subject: "¡Bienvenida a Trenzame!", html });
}

type SendReviewRequestEmailParams = {
  to: string;
  professionalDisplayName: string;
  styleName: string;
  reviewUrl: string;
};

export async function sendReviewRequestEmail({
  to,
  professionalDisplayName,
  styleName,
  reviewUrl,
}: SendReviewRequestEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <p>¿Qué tal tu cita de "${styleName}" con ${professionalDisplayName}?</p>
      <p>Tu opinión ayuda a otras clientas a elegir con confianza.</p>
      <p style="margin: 24px 0;">
        <a href="${reviewUrl}" style="background:#8a3324;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">
          Dejar mi valoración
        </a>
      </p>
    </div>
  `;

  await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject: `¿Qué tal tu cita con ${professionalDisplayName}?`,
    html,
  });
}
