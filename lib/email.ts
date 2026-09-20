import { Resend } from "resend";
import { formatSlotDate, formatSlotTime } from "@/lib/format";

// En-tête partagé des 4 emails : mise en page en <table> (pas flex/grid,
// ignorés par le moteur de rendu Word d'Outlook desktop), width/height en
// attributs HTML sur l'<img> (le CSS externe n'est pas fiable dans les
// clients mail), et une pile de polices de secours classique à la place de
// Fraunces (les web fonts ne se chargent pas de façon fiable par email). Le
// Z reste en version unie clay (pas le dégradé du logo web) : à la taille
// d'une icône d'email le dégradé rendrait mal, l'unie est cohérente avec le
// favicon.
const EMAIL_HEADER = `
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    <tr>
      <td style="vertical-align:middle;padding-right:10px;">
        <img src="https://trenzame.vercel.app/icon-email.png" width="36" height="36" alt="Trenzame" style="display:block;border-radius:8px;" />
      </td>
      <td style="vertical-align:middle;">
        <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:700;color:#18140f;">Tren<span style="color:#8a3324;">z</span>ame</span>
      </td>
    </tr>
  </table>
`;

// Domaine d'envoi : par défaut le domaine de test de Resend, qui ne délivre
// qu'à l'adresse du compte Resend lui-même. Pour envoyer à de vraies
// clientes, il faut vérifier un domaine (ex. trenzame.com) sur resend.com
// et définir RESEND_FROM_EMAIL avec une adresse de ce domaine.
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "Trenzame <onboarding@resend.dev>";

// Adresse où atterrissent les réponses des clientes qui répondent directement
// à un email (l'adresse d'envoi elle-même n'est pas une vraie boîte mail).
const REPLY_TO_EMAIL = "trenzamee@gmail.com";

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY n'est pas défini (voir .env.example).");
  }
  return new Resend(apiKey);
}

type SendWelcomeEmailParams = {
  to: string;
  firstName: string;
};

export async function sendWelcomeEmail({ to, firstName }: SendWelcomeEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${EMAIL_HEADER}
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:20px;font-weight:700;color:#18140f;margin:0 0 12px;">¡Bienvenida, ${firstName}!</p>
      <p style="font-size:14px;line-height:1.6;color:#333;margin:0 0 16px;">
        Tu cuenta en Trenzame ya está lista. Desde aquí podrás ver tus próximas citas, tu historial
        de reservas, y reservar con tus profesionales de confianza en un par de clics.
      </p>
      <p style="margin:24px 0;">
        <a href="https://trenzame.com/cuenta" style="background:#8a3324;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;font-size:14px;">
          Ver mi cuenta
        </a>
      </p>
      <p style="font-size:12px;color:#6b6459;border-top:1px solid #ddd0b3;padding-top:16px;margin-top:24px;">
        ¿Alguna pregunta? Escríbenos a <a href="mailto:hola@trenzame.com" style="color:#8a3324;">hola@trenzame.com</a>.
      </p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, replyTo: REPLY_TO_EMAIL, subject: "¡Bienvenida a Trenzame!", html });
}

type SendProfessionalWelcomeEmailParams = {
  to: string;
  displayName: string;
};

export async function sendProfessionalWelcomeEmail({
  to,
  displayName,
}: SendProfessionalWelcomeEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${EMAIL_HEADER}
      <p>¡Bienvenida a Trenzame, ${displayName}!</p>
      <p>Tu cuenta profesional acaba de crearse. Desde tu panel de administración podrás
      añadir tu salón, publicar tu galería de trabajos y gestionar tus citas.</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, replyTo: REPLY_TO_EMAIL, subject: "¡Bienvenida a Trenzame!", html });
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
      ${EMAIL_HEADER}
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
    replyTo: REPLY_TO_EMAIL,
    subject: `¿Qué tal tu cita con ${professionalDisplayName}?`,
    html,
  });
}

type SendPasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

export async function sendPasswordResetEmail({ to, resetUrl }: SendPasswordResetEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${EMAIL_HEADER}
      <p>Has pedido restablecer tu contraseña de Trenzame.</p>
      <p style="margin: 24px 0;">
        <a href="${resetUrl}" style="background:#8a3324;color:#fff;padding:12px 24px;text-decoration:none;border-radius:4px;display:inline-block;">
          Elegir nueva contraseña
        </a>
      </p>
      <p style="color:#6b6459;font-size:13px;">Este enlace caduca en 30 minutos y solo puede usarse una vez. Si no has pedido esto, puedes ignorar este email.</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, replyTo: REPLY_TO_EMAIL, subject: "Restablece tu contraseña — Trenzame", html });
}

type SendBookingConfirmationEmailParams = {
  to: string;
  professionalDisplayName: string;
  styleName: string;
  startAt: Date;
  priceLabel: string;
};

// À la cliente, juste après la réservation.
export async function sendBookingConfirmationEmail({
  to,
  professionalDisplayName,
  styleName,
  startAt,
  priceLabel,
}: SendBookingConfirmationEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${EMAIL_HEADER}
      <p>¡Tu cita está confirmada!</p>
      <p><strong>${styleName}</strong> con ${professionalDisplayName}</p>
      <p>${formatSlotDate(startAt)} · ${formatSlotTime(startAt)}</p>
      <p>${priceLabel}</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, replyTo: REPLY_TO_EMAIL, subject: `Cita confirmada — ${styleName}`, html });
}

type SendBookingNotificationEmailParams = {
  to: string;
  clientName: string;
  clientPhone: string;
  styleName: string;
  startAt: Date;
};

// Au professionnel, juste après la réservation, avec les coordonnées de la
// cliente pour qu'il puisse la contacter si besoin.
export async function sendBookingNotificationEmail({
  to,
  clientName,
  clientPhone,
  styleName,
  startAt,
}: SendBookingNotificationEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${EMAIL_HEADER}
      <p>Nueva reserva recibida.</p>
      <p><strong>${styleName}</strong></p>
      <p>${formatSlotDate(startAt)} · ${formatSlotTime(startAt)}</p>
      <p>Clienta: ${clientName} · ${clientPhone}</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, replyTo: REPLY_TO_EMAIL, subject: `Nueva reserva — ${styleName}`, html });
}

type SendBookingReminderEmailParams = {
  to: string;
  professionalDisplayName: string;
  styleName: string;
  startAt: Date;
};

// Rappel automatique 24h avant le rendez-vous (voir cron
// /api/cron/send-booking-reminders).
export async function sendBookingReminderEmail({
  to,
  professionalDisplayName,
  styleName,
  startAt,
}: SendBookingReminderEmailParams): Promise<void> {
  const resend = getResend();

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      ${EMAIL_HEADER}
      <p>Recordatorio: mañana a las ${formatSlotTime(startAt)} tienes tu cita de "${styleName}" con
      ${professionalDisplayName}.</p>
    </div>
  `;

  await resend.emails.send({ from: FROM_EMAIL, to, replyTo: REPLY_TO_EMAIL, subject: `Mañana: tu cita de ${styleName}`, html });
}
