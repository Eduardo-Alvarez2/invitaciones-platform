import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// 📊 Agregamos BarChart3 para el ícono de Gestión / Panel de Control
import {
  MessageCircle,
  Smartphone,
  Edit3,
  Share2,
  Eye,
  BarChart3,
} from "lucide-react";
import Template from "../../templates/Template";
import { demoEventos } from "../../mocks/demoEventos";
import AuthModal from "./AuthModal";
import Logo from "../../components/Logo";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 ESTADOS DE LA UI (Corregidos para evitar el ReferenceError)
  const [isAuthOpen, setIsAuthOpen] = useState(false); // Modal de login
  const [showHelp, setShowHelp] = useState(false); // Acordeón principal de Ayuda
  const [openFaq, setOpenFaq] = useState(null); // Preguntas individuales de la FAQ

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("draftEvento");
    window.location.reload(); // Recarga para limpiar estados
  };

  const templates = [
    { id: "classic", nombre: "Classic", descripcion: "Elegante y tradicional" },
    { id: "modern", nombre: "Modern", descripcion: "Estilo vanguardista" },
    { id: "minimal", nombre: "Minimal", descripcion: "Simple y limpio" },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      {/* 🟢 WHATSAPP FLOTANTE */}
      <a
        href="https://wa.me/542926465696?text=Hola!%20Tengo%20una%20consulta%20sobre%20las%20invitaciones"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-[60] bg-white text-gray-900 p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-gray-100 flex items-center justify-center group"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp"
          className="w-6 h-6"
        />
      </a>

      {/* 🔝 NAVBAR */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-black/10 backdrop-blur-md border-b border-white/10">
        <h1 className="text-xl font-serif font-bold tracking-[0.2em] text-white uppercase">
          <Logo />
        </h1>
        <div className="flex gap-4">
          {!token ? (
            <button
              onClick={() => setIsAuthOpen(true)} // 👈 Abre el modal en vez de navegar
              className="px-6 py-2 text-[10px] font-black uppercase text-white border border-white/30 rounded-full hover:bg-white hover:text-black transition-all duration-500"
            >
              Iniciar sesión
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-[10px] font-black uppercase text-white tracking-widest hover:opacity-70 transition-opacity"
              >
                Mis Eventos
              </button>
              <button
                onClick={handleLogout}
                className="text-[10px] font-black uppercase text-red-400 tracking-widest hover:opacity-70 transition-opacity"
              >
                Salir
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 🎯 HERO SECTION */}
      <section className="relative h-[85vh] w-full flex items-center justify-center text-center px-6 overflow-hidden pt-32">
        <div className="absolute inset-0 z-0 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-50"
          >
            <source src="/Hero.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/40 via-transparent to-white"></div>

        <div className="relative z-20 max-w-4xl mx-auto space-y-8">
          <h2 className="text-white text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
            Crea invitaciones digitales
            <br />
            <span className="font-light italic opacity-90 text-indigo-200">
              simples, elegantes y rápidas
            </span>
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
            Diseños modernos que podés personalizar en minutos y compartir
            fácilmente con tus invitados.
          </p>
          <div className="pt-4">
            <button
              onClick={() =>
                document
                  .getElementById("templates")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="px-12 py-4 bg-indigo-600 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-500/20"
            >
              Ver Catálogo
            </button>
          </div>
        </div>
      </section>

      {/* 🚀 SECCIÓN 4 PASOS */}
      <div className="relative z-30 bg-white py-16 border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Contenedor que centra la columna entera en mobile y arma la grilla en desktop */}
          <div className="flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[290px] sm:max-w-none mx-auto">
            <StepItem
              icon={<Smartphone size={22} />}
              title="1. Elegí"
              text="Seleccioná un diseño premium"
            />
            <StepItem
              icon={<Edit3 size={22} />}
              title="2. Personalizá"
              text="Cargá tus fotos y detalles"
            />
            <StepItem
              icon={<Share2 size={22} />}
              title="3. Compartí"
              text="Enviá el link por WhatsApp"
            />
            <StepItem
              icon={<BarChart3 size={22} />}
              title="4. Gestioná"
              text="Controlá asistencias en tiempo real"
            />
          </div>
        </div>
      </div>

      {/* 🎨 SECCIÓN DE TEMPLATES (Showroom) */}
      <section id="templates" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-xl font-serif font-bold mb-20 text-center text-gray-400 tracking-[0.3em] uppercase">
            Elegí tu diseño
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            {templates.map((t) => (
              <div key={t.id} className="flex flex-col items-center group">
                {/* 📱 MOCKUP DE CELULAR REALISTA */}
                <div className="relative w-[320px] sm:w-[360px] h-[560px] sm:h-[620px] mb-8 ring-[10px] ring-gray-900 rounded-[2.8rem] shadow-2xl bg-white overflow-hidden flex flex-col">
                  {/* El notch/bocina de arriba */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-50"></div>

                  {/* 🔒 PANTALLA AISLADA CON IFRAME */}
                  <iframe
                    title={`Preview ${t.nombre}`}
                    src={`/demo/${t.id}?preview=true`}
                    className="w-full h-full border-none no-scrollbar"
                    scrolling="yes"
                  />
                </div>

                <div className="text-center space-y-5">
                  <div>
                    <h4 className="text-xl font-bold text-gray-800 tracking-tight italic">
                      {t.nombre}
                    </h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                      {t.descripcion}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => navigate(`/editor?template=${t.id}`)}
                      className="px-10 py-4 bg-gray-900 text-white rounded-full font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200"
                    >
                      Elegir este estilo
                    </button>

                    <button
                      onClick={() => window.open(`/demo/${t.id}`, "_blank")}
                      className="flex items-center justify-center gap-2 text-[9px] font-black uppercase text-gray-400 hover:text-gray-900 transition-colors tracking-[0.2em]"
                    >
                      <Eye size={12} /> Ver Demo Completa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ❓ SECCIÓN DE AYUDA COMPACTA (COLAPSABLE) */}
      <section className="py-8 px-6 bg-white border-t border-gray-100 transition-all duration-500">
        <div className="max-w-3xl mx-auto">
          {/* Botón Principal de Despliegue */}
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex justify-between items-center py-4 px-2 hover:bg-gray-50/50 rounded-2xl transition-all group"
          >
            <div className="text-left space-y-1">
              <h3 className="text-sm font-serif font-bold text-gray-900 tracking-[0.2em] uppercase group-hover:text-indigo-600 transition-colors">
                ¿Necesitás ayuda?
              </h3>
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">
                {showHelp
                  ? "Cerrar sección de asistencia"
                  : "Preguntas frecuentes y soporte por WhatsApp"}
              </p>
            </div>
            <span className="text-xl text-gray-400 font-light px-4">
              {showHelp ? "−" : "+"}
            </span>
          </button>

          {/* Contenido Desplegable */}
          <div
            className={`transition-all duration-500 overflow-hidden ${showHelp ? "max-h-[800px] opacity-100 mt-8" : "max-h-0 opacity-0"}`}
          >
            <div className="space-y-4 pt-2">
              {[
                {
                  q: "¿Cómo personalizo mi invitación?",
                  a: "Es súper fácil. Elegís el diseño que más te guste, entrás al editor y vas completando los campos: nombres, fecha, cuenta regresiva, fotos y los links de ubicación. Los cambios se guardan al instante.",
                },
                {
                  q: "¿Qué pasa si me cuesta cargar los datos o las fotos?",
                  a: "¡No te preocupes! Si te trabás en cualquier paso o no sabés cómo poner la ubicación de la fiesta, nos escribís a nuestro WhatsApp exclusivo de soporte y nosotros te ayudamos a dejarla lista sin costo adicional.",
                },
                {
                  q: "¿Cómo funciona el Panel de Control de asistencia?",
                  a: "Cuando tus invitados entran al link de tu tarjeta y confirman si van, esos datos viajan directo a tu panel privado. Vas a poder ver la lista completa en tiempo real, quiénes confirmaron y leer los mensajes especiales que te dejaron.",
                },
                {
                  q: "¿Cuánto tiempo queda online la tarjeta?",
                  a: "La tarjeta y el panel de control permanecen activos desde el momento del pago hasta 15 días después de que finalice tu evento, para que puedas ver y descargar los datos con total tranquilidad.",
                },
              ].map((faq, index) => (
                <div key={index} className="border-b border-gray-50 pb-4">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full flex justify-between items-center text-left py-2.5 text-xs font-bold text-gray-700 uppercase tracking-wide hover:text-indigo-600 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="text-base text-gray-400">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  <div
                    className={`transition-all duration-300 overflow-hidden ${openFaq === index ? "max-h-32 opacity-100 mt-2" : "max-h-0 opacity-0"}`}
                  >
                    <p className="text-gray-500 text-xs leading-relaxed font-light pl-1">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 📞 Botón de Soporte Directo */}
            <div className="mt-10 text-center p-6 bg-gray-50 rounded-2xl space-y-3">
              <p className="text-[10px] font-black uppercase text-gray-600 tracking-widest">
                ¿Preferís que la armemos nosotros de cero?
              </p>
              <a
                href="https://wa.me/542926465696?text=Hola!%20Necesito%20ayuda%20para%20crear%20mi%20invitación"
                target="_blank"
                rel="noreferrer"
                className="inline-block px-6 py-3 bg-green-600 text-white rounded-full font-black text-[9px] uppercase tracking-[0.2em] hover:bg-green-700 hover:scale-105 transition-all shadow-md shadow-green-600/10"
              >
                Soporte por WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-20 text-center bg-white border-t border-gray-50">
        <p className="text-gray-300 text-[9px] tracking-[0.5em] uppercase font-bold italic">
          © 2026 Invitaciones Digitales Premium
        </p>
      </footer>

      {/* 🔐 COMPONENTE MODAL */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `,
        }}
      />
    </div>
  );
}

function StepItem({ icon, title, text }) {
  return (
    <div className="flex items-center gap-5 justify-start w-full group">
      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm shrink-0">
        {icon}
      </div>
      <div className="text-left flex flex-col justify-center">
        <h4 className="text-gray-900 text-xs font-black uppercase tracking-widest leading-none mb-1.5">
          {title}
        </h4>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight leading-tight">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Home;
