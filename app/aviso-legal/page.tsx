import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso legal — BraidHub",
};

export default function AvisoLegalPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Aviso legal</h1>

      <div className="flex flex-col gap-4 text-sm text-ink/80">
        <p>
          En cumplimiento del deber de información recogido en el artículo 10 de la
          Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y
          de Comercio Electrónico (LSSI-CE), se indican a continuación los datos
          identificativos del titular de este sitio web.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">1. Datos identificativos</h2>
          <p>
            Titular: BraidHub <br />
            Contacto: a través del botón de WhatsApp / Instagram disponible en la
            plataforma. <br />
            <span className="text-ink/60">
              [Pendiente de completar con la denominación social o nombre y apellidos,
              NIF/CIF, domicilio y correo electrónico de contacto una vez esté
              constituida la actividad.]
            </span>
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">2. Objeto</h2>
          <p>
            BraidHub es una plataforma de reserva de citas para servicios de trenzas.
            Permite a las usuarias consultar un catálogo de estilos y reservar un
            turno con las profesionales disponibles en la plataforma.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">3. Condiciones de uso</h2>
          <p>
            El acceso y uso de este sitio web es gratuito y no requiere registro
            previo por parte de la usuaria. Al reservar una cita, la usuaria facilita
            determinados datos personales (nombre, teléfono y/o correo electrónico)
            necesarios para gestionar dicha reserva.
          </p>
          <p>
            La usuaria se compromete a hacer un uso adecuado de los contenidos y
            servicios que se ofrecen a través de este sitio web y a no emplearlos
            para incurrir en actividades ilícitas o contrarias a la buena fe y al
            ordenamiento legal.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">4. Propiedad intelectual</h2>
          <p>
            Los contenidos de este sitio web (textos, imágenes, diseño, logotipos)
            son propiedad de sus respectivos titulares. Queda prohibida su
            reproducción total o parcial sin autorización expresa.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">5. Limitación de responsabilidad</h2>
          <p>
            No se garantiza la disponibilidad continuada del sitio web, ni la
            ausencia de errores en los contenidos. Las citas quedan sujetas a
            confirmación por parte de la profesional correspondiente.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">6. Legislación aplicable</h2>
          <p>
            Las presentes condiciones se rigen por la legislación española. Para
            cualquier controversia derivada del uso de este sitio web, las partes se
            someten a los juzgados y tribunales que resulten competentes conforme a
            la normativa vigente.
          </p>
        </section>
      </div>
    </div>
  );
}
