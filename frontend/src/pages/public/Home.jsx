import React from "react";
import { useNavigate } from "react-router-dom";
import MiniPreview from "../../components/MiniPreview";
import { demoEventos } from "../../mocks/demoEventos";

function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const templates = [
    { id: "classic", nombre: "Classic", descripcion: "Elegante y tradicional", color: "from-amber-50 to-orange-100" },
    { id: "modern", nombre: "Modern", descripcion: "Estilo vanguardista", color: "from-blue-50 to-indigo-100" },
    { id: "minimal", nombre: "Minimal", descripcion: "Simple y limpio", color: "from-gray-50 to-slate-200" }
  ];

  const elegirTemplate = (template) => {
    const target = `/crear-evento?template=${template}`;
    if (!token || token === "undefined" || token === "null") {
      navigate(`/login?redirect=${encodeURIComponent(target)}`);
    } else {
      navigate(target);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      
      {/* 🔝 NAVBAR REFORZADO (Para que siempre se vea el botón ingresar) */}
      <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-black/20 backdrop-blur-md border-b border-white/10">
        <h1 className="text-xl font-serif font-bold tracking-widest text-white">
          INVITACIONES
        </h1>

        <div className="flex items-center gap-4">
          {token && (
            <span className="hidden md:block text-[10px] uppercase tracking-widest text-white/80 font-medium">
              Sesión activa
            </span>
          )}
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 text-xs uppercase tracking-widest text-white border border-white/40 rounded-full bg-white/10 hover:bg-white hover:text-black transition-all duration-500 font-bold"
          >
            {token ? "Mi Cuenta" : "Iniciar sesión"}
          </button>
        </div>
      </nav>

      {/* 🎯 HERO CON TU TEXTO ORIGINAL Y VIDEO */}
      <section className="relative h-[90vh] w-full flex items-center justify-center text-center px-6 overflow-hidden">
        
        {/* VIDEO DE FONDO (Usa tu archivo /Hero.mp4) */}
        <div className="absolute inset-0 z-0 bg-black">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-60 grayscale-[20%] brightness-[0.8]"
          >
            <source src="/Hero.mp4" type="video/mp4" />
          </video>
        </div>

        {/* OVERLAY GRADIENTE (Mejora legibilidad del texto) */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/50 via-transparent to-white"></div>

        {/* CONTENIDO TEXTUAL */}
        <div className="relative z-20 max-w-3xl mx-auto space-y-6">
          <h2 className="text-white text-4xl md:text-6xl font-semibold leading-tight tracking-tight">
            Crea invitaciones digitales
            <br />
            <span className="font-light italic opacity-90">simples, elegantes y rápidas</span>
          </h2>

          <p className="text-white/90 text-lg md:text-xl font-light max-w-xl mx-auto leading-relaxed">
            Diseños modernos que podés personalizar en minutos y compartir fácilmente con tus invitados.
          </p>

          <div className="pt-8">
            <button
              onClick={() => document.getElementById('templates').scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 bg-indigo-600 text-white rounded-full font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-500/30"
            >
              Comenzar ahora
            </button>
          </div>
        </div>
      </section>

      {/* 🎨 SECCIÓN DE TEMPLATES MEJORADA */}
      <section id="templates" className="py-24 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          
          <h3 className="text-3xl font-serif font-semibold mb-16 text-gray-900">
            Elegí tu diseño
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {templates.map((t) => (
              <div
                key={t.id}
                className="group flex flex-col items-center bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                
                {/* 📱 CELULAR REALISTA CON TU MINIPREVIEW */}
                <div className="relative w-48 h-[380px] mb-8">
                  {/* Chasis del celular */}
                  <div className="absolute inset-0 bg-[#1a1a1a] rounded-[2.8rem] p-2.5 shadow-2xl ring-1 ring-black/5">
                    {/* Isla Dinámica (Efecto iPhone) */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-black rounded-full z-40"></div>
                    
                    {/* Pantalla Interna */}
                    <div className={`w-full h-full rounded-[2.2rem] bg-gradient-to-br ${t.color} flex items-center justify-center overflow-hidden relative`}>
                      <div className="w-full h-full transform scale-[0.9] origin-center">
                        <MiniPreview evento={demoEventos[t.id]} variant={t.id} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* INFO DEL TEMPLATE */}
                <div className="space-y-4 w-full">
                  <h4 className="text-xl font-bold text-gray-800">{t.nombre}</h4>
                  <p className="text-gray-500 text-sm font-light h-10">
                    {t.descripcion}
                  </p>

                  <div className="flex flex-col gap-3 pt-4">
                    <button
                      onClick={() => elegirTemplate(t.id)}
                      className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                    >
                      Usar diseño
                    </button>
                    <button
                      onClick={() => navigate(`/demo/${t.id}`)}
                      className="w-full py-3 text-xs uppercase tracking-widest font-bold text-gray-400 hover:text-indigo-600 transition-colors border border-gray-50 rounded-xl hover:bg-gray-50"
                    >
                      Ver demo en vivo
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER SIMPLE */}
      <footer className="py-12 text-center border-t border-gray-50">
        <p className="text-gray-400 text-[10px] tracking-[0.3em] uppercase">© 2024 Invitaciones Digitales Premium</p>
      </footer>

    </div>
  );
}

export default Home;