import React from "react";

/**
 * HeroMinimal: Componente de estilo puramente visual para Bodas/Eventos.
 * Estética de "espacio en blanco", minimalismo puro y elegancia tipográfica.
 */
const HeroMinimal = ({ titulo, mensaje, imagen }) => {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center bg-white px-6">
      {/* Contenedor de imagen centralizada con marco minimalista */}
      <div className="relative w-full max-w-2xl aspect-[4/5] md:aspect-video overflow-hidden mb-16 shadow-sm group">
        <img 
          src={imagen} 
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-105 group-hover:scale-100" 
          alt="Momento Minimalista" 
        />
        {/* Overlay muy sutil solo para textura */}
        <div className="absolute inset-0 bg-stone-100/10"></div>
      </div>

      {/* Contenido textual */}
      <div className="text-center space-y-8 animate-fade-in">
        <div className="space-y-2">
          {/* Tag minúsculo y espaciado */}
          <span className="text-[9px] uppercase tracking-[0.6em] text-stone-400 font-light block mb-4">
            MOMENTO • ETERNO
          </span>
          
          {/* Título: Serif, muy fino y ligero */}
          <h1 className="text-4xl md:text-6xl font-serif font-light text-stone-800 tracking-tight leading-tight italic">
            {titulo}
          </h1>
        </div>

        {/* Divisor minimalista (una sola línea fina) */}
        <div className="w-12 h-px bg-stone-200 mx-auto"></div>

        {/* Mensaje corto y aireado */}
        <p className="text-stone-400 font-light text-sm md:text-base max-w-md mx-auto leading-relaxed tracking-widest uppercase">
          {mensaje}
        </p>

        {/* Indicador de scroll: solo una línea vertical */}
        <div className="pt-12">
          <div className="w-px h-16 bg-gradient-to-b from-stone-200 to-transparent mx-auto"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { 
            opacity: 0; 
            transform: translateY(15px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        .animate-fade-in {
          animation: fade-in-up 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroMinimal;