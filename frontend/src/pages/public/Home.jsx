import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Smartphone, Edit3, Share2, Eye } from "lucide-react";
import Template from "../../templates/Template";
import { demoEventos } from "../../mocks/demoEventos";
import AuthModal from "./AuthModal";
import Logo from "../../components/Logo";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔐 Estado para el Modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

      {/* 🚀 SECCIÓN 3 PASOS */}
      <div className="relative z-30 bg-white py-16 border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
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
                <div className="relative w-[290px] sm:w-[320px] md:w-[350px] lg:w-[375px] h-[580px] md:h-[660px] lg:h-[720px] mb-8 ring-[10px] ring-gray-900 rounded-[2.8rem] shadow-2xl bg-white overflow-hidden transition-transform duration-500 group-hover:scale-[1.02] flex flex-col">
                  {/* El notch/bocina de arriba */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-gray-900 rounded-b-2xl z-50"></div>

                  {/* 🔒 PANTALLA INTERNA: Control estricto de scroll */}
                  <div className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth bg-white">
                    {/* 🎯 CONTENEDOR ANCLA: Ocupa el 100% del ancho del teléfono y su altura es 100% dinámica */}
                    <div className="w-full h-auto block">
                      <Template evento={demoEventos[t.id]} />
                    </div>
                  </div>
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
    <div className="flex items-center gap-5 justify-center md:justify-start group">
      <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm">
        {icon}
      </div>
      <div className="text-left">
        <h4 className="text-gray-900 text-xs font-black uppercase tracking-widest leading-none mb-1.5">
          {title}
        </h4>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-tight">
          {text}
        </p>
      </div>
    </div>
  );
}

export default Home;
