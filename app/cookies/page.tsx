import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de cookies — BraidHub",
};

export default function CookiesPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Política de cookies</h1>

      <div className="flex flex-col gap-4 text-sm text-ink/80">
        <p>
          Este sitio web utiliza únicamente cookies técnicas, necesarias para el
          funcionamiento de la plataforma. No utilizamos cookies de analítica, de
          publicidad ni de seguimiento de terceros.
        </p>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">Cookie utilizada</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-line text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-3 py-2 font-medium">Nombre</th>
                  <th className="px-3 py-2 font-medium">Finalidad</th>
                  <th className="px-3 py-2 font-medium">Tipo</th>
                  <th className="px-3 py-2 font-medium">Duración</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-line">
                  <td className="px-3 py-2 font-mono text-xs">eva_admin_session</td>
                  <td className="px-3 py-2">
                    Mantener la sesión iniciada en la zona de administración
                    (agenda de la profesional).
                  </td>
                  <td className="px-3 py-2">Técnica / necesaria</td>
                  <td className="px-3 py-2">Sesión</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-ink/60">
            Al ser una cookie técnica estrictamente necesaria, no requiere el
            consentimiento previo de la usuaria conforme al artículo 22.2 de la
            LSSI-CE.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">¿Cómo desactivar las cookies?</h2>
          <p>
            Puedes configurar tu navegador para bloquear o eliminar las cookies.
            Ten en cuenta que, si desactivas la cookie técnica de sesión, no podrás
            acceder a la zona de administración protegida por contraseña.
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="font-medium text-ink">Cambios en esta política</h2>
          <p>
            Si en el futuro se incorporan cookies de analítica o de terceros, esta
            política se actualizará y se solicitará el consentimiento
            correspondiente antes de su instalación.
          </p>
        </section>
      </div>
    </div>
  );
}
