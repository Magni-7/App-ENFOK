type ContactButtonProps = {
  whatsappNumber?: string | null;
  instagramUsername?: string | null;
  message?: string;
  className?: string;
};

const DEFAULT_MESSAGE =
  "Bonjour Eva ! J'aimerais discuter d'un style de tresse personnalisé, hors catalogue.";

export default function ContactButton({
  whatsappNumber,
  instagramUsername,
  message = DEFAULT_MESSAGE,
  className = "",
}: ContactButtonProps) {
  const whatsappHref = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : null;
  const instagramHref = instagramUsername ? `https://ig.me/m/${instagramUsername}` : null;

  if (!whatsappHref && !instagramHref) return null;

  return (
    <div className={`flex flex-col items-start gap-2 ${className}`}>
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
        >
          Design personnalisé — WhatsApp
        </a>
      )}
      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink underline underline-offset-4 hover:no-underline"
        >
          ou envoyer un message sur Instagram
        </a>
      )}
    </div>
  );
}
