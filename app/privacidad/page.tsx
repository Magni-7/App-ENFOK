import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidad — Trenzame",
};

export default function PrivacidadPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Política de privacidad</h1>

      <div className="flex flex-col gap-4 text-sm text-ink/80">
        <p>
          En Trenzame tratamos los datos personales que las usuarias facilitan al
          reservar una cita conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley
          Orgánica 3/2018, de Protección de Datos Personales y garantía de los
          derechos digitales (LOPDGDD).
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">1. Responsable del tratamiento</h2>
          <p>
            Trenzame <br />
            <span className="text-ink/60">
              [Pendiente de completar con la identificación fiscal y datos de
              contacto del responsable una vez esté constituida la actividad.]
            </span>
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">2. Datos que recopilamos</h2>
          <p>Al reservar una cita a través del catálogo, recogemos:</p>
          <ul className="list-disc pl-5">
            <li>Nombre de la clienta</li>
            <li>Teléfono y/o correo electrónico de contacto</li>
            <li>Estilo y franja horaria seleccionados</li>
          </ul>
          <p>
            No se solicitan datos de pago ni datos de categoría especial. El acceso
            al área de administración de la profesional utiliza únicamente una
            cookie técnica de sesión (ver{" "}
            <a href="/cookies" className="underline underline-offset-4 hover:no-underline">
              Política de cookies
            </a>
            ).
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">3. Finalidad del tratamiento</h2>
          <p>
            Los datos facilitados se utilizan exclusivamente para gestionar la
            reserva de la cita, contactar con la clienta en relación con dicha
            reserva y permitir a la profesional organizar su agenda.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">4. Base legal</h2>
          <p>
            La base legal para el tratamiento es la ejecución de la relación
            precontractual/contractual derivada de la solicitud de reserva
            (art. 6.1.b RGPD).
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">5. Conservación de los datos</h2>
          <p>
            Los datos se conservan durante el tiempo necesario para gestionar la
            cita y, posteriormente, durante los plazos legalmente exigibles.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">6. Cesión a terceros</h2>
          <p>
            No se ceden datos a terceros, salvo obligación legal. El botón "Diseño
            personalizado" redirige a WhatsApp o Instagram; el uso de esas
            plataformas queda sujeto a sus propias políticas de privacidad.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">7. Derechos de las personas usuarias</h2>
          <p>
            Puedes ejercer tus derechos de acceso, rectificación, supresión,
            oposición, limitación y portabilidad escribiendo a la profesional a
            través del contacto de WhatsApp o Instagram indicado en la plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}
