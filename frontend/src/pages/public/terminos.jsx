import React from 'react';

const Terminos = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-slate-700 bg-white">
      <h1 className="text-3xl font-bold mb-2 text-slate-900">Términos y Condiciones de Uso y Política de Privacidad</h1>
      <p className="text-sm text-slate-500 mb-8">Última actualización: Julio 2026</p>

      <p className="mb-6 leading-relaxed">
        Bienvenido a <strong>INVITTO</strong>. Al acceder y utilizar nuestra plataforma web, usted acepta cumplir y estar sujeto a los siguientes Términos y Condiciones. Si no está de acuerdo con alguna parte de estos términos, le solicitamos que no utilice nuestros servicios.
      </p>

      <hr className="my-8 border-slate-200" />

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">1. Descripción del Servicio</h2>
        <p className="leading-relaxed">
          INVITTO es una plataforma digital que permite a los usuarios registrarse, crear, personalizar y gestionar invitaciones digitales para eventos sociales o corporativos, así como también controlar la lista de confirmación de asistencia de sus invitados.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">2. Registro y Responsabilidad de la Cuenta</h2>
        <p className="leading-relaxed">
          Para utilizar las funciones avanzadas del sistema, el usuario debe registrarse aportando datos verídicos y actualizados (Nombre, Correo Electrónico). El usuario es el único responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">3. Propiedad Intelectual y Responsabilidad del Contenido</h2>
        <p className="leading-relaxed mb-3">
          El usuario retiene todos los derechos sobre el contenido (textos, imágenes, detalles del evento) que cargue en la plataforma. Sin embargo, al publicarlo, garantiza que posee los derechos necesarios para hacerlo y que no infringe derechos de propiedad intelectual de terceros.
        </p>
        <p className="leading-relaxed">
          INVITTO se reserva el derecho de dar de baja o suspender de manera inmediata cualquier evento o cuenta cuyo contenido sea considerado ofensivo, ilegal, fraudulento o que atente contra la moral y las buenas costumbres, sin derecho a reclamo o indemnización alguna por parte del usuario.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">4. Condiciones de Pago, Tarifas y Reembolsos</h2>
        <p className="leading-relaxed mb-3">
          El acceso a la activación final de las invitaciones está sujeto al pago de las tarifas vigentes publicadas en el sitio web. Los pagos se procesan de forma externa y segura a través de la pasarela de pagos <strong>Mercado Pago</strong>. INVITTO no almacena ni tiene acceso a los datos de tarjetas de crédito o débito de los usuarios.
        </p>
        <p className="leading-relaxed">
          Debido a la naturaleza digital, inmediata y consumible del servicio prestado, <strong>una vez realizado el pago y habilitada la invitación web, no se realizarán reembolsos ni devoluciones de dinero</strong>, excepto en aquellos casos donde se demuestren fallas técnicas persistentes e insubsanables en la plataforma que impidan la prestación básica del servicio.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">5. Política de Privacidad y Protección de Datos (Ley 25.326)</h2>
        <p className="leading-relaxed mb-3">
          En cumplimiento con la <strong>Ley N° 25.326 de Protección de Datos Personales de la República Argentina</strong>, INVITTO informa que los datos personales recopilados (tanto del organizador como de los invitados que confirman asistencia) son utilizados exclusivamente para la correcta prestación, administración y optimización del servicio del evento en cuestión.
        </p>
        <ul className="list-disc pl-6 space-y-2 leading-relaxed">
          <li>Los datos de los invitados (Nombres, confirmaciones) se recopilan por cuenta y orden del organizador del evento, quien actúa como responsable de dicha base de datos.</li>
          <li>INVITTO se compromete a no vender, ceder, alquilar ni compartir la información personal de sus usuarios e invitados con terceras empresas bajo ningún concepto.</li>
          <li>Se implementan medidas de seguridad técnicas y organizativas estándar de la industria para proteger los datos contra accesos no autorizados, pérdidas o alteraciones.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">6. Limitación de Responsabilidad</h2>
        <p className="leading-relaxed">
          INVITTO trabaja activamente para garantizar la disponibilidad del servicio las 24 horas del día. Sin embargo, la plataforma se proporciona "tal cual está", por lo que no nos hacemos responsables por interrupciones temporales causadas por fallas de conectividad a internet, tareas de mantenimiento programadas o problemas externos en los servidores de infraestructura o servicios de terceros.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">7. Modificaciones de los Términos</h2>
        <p className="leading-relaxed">
          INVITTO se reserva el derecho de modificar estos términos en cualquier momento. Las modificaciones entrarán en vigencia inmediatamente después de su publicación en esta sección. El uso continuado de la plataforma constituirá la aceptación de los nuevos términos.
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-xl font-semibold mb-3 text-slate-900">8. Contacto</h2>
        <p className="leading-relaxed">
          Para cualquier consulta, reclamo o solicitud relacionada con estos Términos y Condiciones o el ejercicio de derechos sobre sus datos personales, puede comunicarse a nuestro correo oficial de soporte: <strong>soporte@invitto.com</strong> 
        </p>
      </section>
    </div>
  );
};

export default Terminos;