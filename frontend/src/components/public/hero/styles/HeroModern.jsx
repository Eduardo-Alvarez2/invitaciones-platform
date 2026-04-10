import React from "react";

/**
 * HeroModern: Componente de estilo puramente visual para Bodas/Eventos.
 * Diseño vanguardista con tipografía de alto impacto y estética minimalista-dark.
 */
const HeroModern = ({ titulo, mensaje, imagen }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black text-white">
      {/* Fondo con imagen, zoom infinito y desaturación */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imagen} 
          className="w-full h-full object-cover opacity-60 scale-110 animate-slow-zoom" 
          alt="Evento Moderno" 
        />
        {/* Overlay con gradiente profundo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-6xl px-6 text-center">
        <div className="space-y-6 animate-slide-up">
          
          {/* Tag minimalista */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-8 h-px bg-indigo-500"></div>
            <span className="text-[10px] md:text-xs uppercase tracking-[0.8em] font-black text-indigo-400">
              Save the date
            </span>
            <div className="w-8 h-px bg-indigo-500"></div>
          </div>

          {/* Título: Tipografía Extra Bold e Itálica */}
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-none uppercase italic">
            {titulo}
          </h1>

          {/* Separador moderno (Línea de acento) */}
          <div className="w-20 h-2 bg-indigo-600 mx-auto my-10"></div>

          {/* Mensaje con tipografía liviana y espaciada */}
          <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed text-white/90 tracking-wide uppercase">
            {mensaje}
          </p>

          {/* Indicador de scroll minimalista */}
          <div className="pt-16">
            <div className="inline-flex flex-col items-center gap-4 opacity-50">
              <span className="text-[9px] uppercase tracking-[0.4em] rotate-90 origin-left translate-x-1">Scroll</span>
              <div className="w-px h-12 bg-gradient-to-b from-white to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Animaciones CSS personalizadas */}
      <style jsx>{`
        @keyframes slow-zoom {
          0% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes slide-up {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-slow-zoom {
          animation: slow-zoom 20s ease-out infinite alternate;
        }
        .animate-slide-up {
          animation: slide-up 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroModern;