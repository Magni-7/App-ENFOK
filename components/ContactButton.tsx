type ContactButtonProps = {
  whatsappNumber?: string | null;
  instagramUsername?: string | null;
  message?: string;
  className?: string;
};

const DEFAULT_MESSAGE =
  "¡Hola! Me gustaría hablar sobre un estilo de trenzas personalizado, fuera de catálogo.";

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
          className="inline-flex items-center justify-center border border-[#25D366] bg-[#25D366] px-6 py-3 text-sm font-medium uppercase tracking-wide text-white transition hover:bg-white hover:text-[#25D366]"
        >
          Diseño personalizado — WhatsApp
        </a>
      )}
      {instagramHref && (
        <a
          href={instagramHref}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-ink underline underline-offset-4 hover:no-underline"
        >
          o enviar un mensaje por Instagram
        </a>
      )}
    </div>
  );
}
