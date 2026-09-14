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

type SendLoginEmailParams = {
  to: string;
  loginUrl: string;
  isNewClient: boolean;
};

export async function sendLoginEmail({ to, loginUrl, isNewClient }: SendLoginEmailParams): Promise<void> {
  const resend = getResend();

  const subject = isNewClient ? "¡Bienvenida a Trenzame!" : "Tu enlace de acceso a Trenzame";

  const intro = isNewClient
    ? `<p>¡Bienvenida a Trenzame! Tu cuenta acaba de crearse.</p>
       <p>Desde aquí podrás ver tus próximas citas y tu historial de reservas.</p>`
    : `<p>Aquí tienes tu enlace para acceder a tu cuenta Trenzame.</p>`;

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${intro}
      <p style="margin: 24px 0;">
        <a href="${loginUrl}" style="background:#8a3324;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">
          Acceder a mi cuenta
        </a>
      </p>
      <p style="color:#6b6459;font-size:13px;">Este enlace caduca en 15 minutos y solo puede usarse una vez. Si no has solicitado esto, puedes ignorar este email.</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, subject, html });
}
