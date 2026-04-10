import React from "react";

/**
 * HeroClassic: Componente de estilo puramente visual para Bodas.
 * Enfocado en la elegancia tradicional y la invitación al evento.
 */
const HeroClassic = ({ titulo, mensaje, imagen }) => {
  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#fdfaf6]">
      {/* Capa de imagen de fondo */}
      <div className="absolute inset-0 z-0">
        <img 
          src={imagen} 
          className="w-full h-full object-cover" 
          alt="Fondo de Boda Clásica" 
        />
        {/* Overlay para legibilidad con desenfoque elegante */}
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px]"></div>
      </div>

      {/* Contenedor de contenido con marco decorativo */}
      <div className="relative z-10 w-[90%] max-w-4xl border border-white/30 p-8 md:p-20 text-center text-white">
        
        {/* Adornos en las esquinas (Estilo herencia clásica) */}
        <div className="absolute top-6 left-6 w-10 h-10 border-t border-l border-white/50"></div>
        <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-white/50"></div>
        <div className="absolute bottom-6 left-6 w-10 h-10 border-b border-l border-white/50"></div>
        <div className="absolute bottom-6 right-6 w-10 h-10 border-b border-r border-white/50"></div>

        <div className="space-y-8 animate-fade-in">
          {/* Tag superior: Invitación formal */}
          <span className="font-serif italic text-base md:text-lg tracking-[0.4em] uppercase opacity-90 block">
            Están invitados a la celebración de
          </span>
          
          {/* Nombres de los novios / Título con serifa clásica */}
          <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight leading-tight">
            {titulo}
          </h1>
          
          {/* Separador ornamental de boda */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="w-16 h-[1px] bg-white/30"></div>
            <span className="text-xl font-serif opacity-70">◈</span>
            <div className="w-16 h-[1px] bg-white/30"></div>
          </div>
          
          {/* Mensaje principal o cita bíblica/romántica */}
          <p className="font-serif italic text-lg md:text-2xl max-w-2xl mx-auto opacity-85 leading-relaxed tracking-wide">
            {mensaje}
          </p>
        </div>
      </div>

      {/* Animación refinada para el estilo Classic */}
      <style jsx>{`
        @keyframes fade-in-soft {
          from { 
            opacity: 0; 
            transform: scale(1.05); 
            filter: blur(10px);
          }
          to { 
            opacity: 1; 
            transform: scale(1);
            filter: blur(0);
          }
        }
        .animate-fade-in {
          animation: fade-in-soft 2.5s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
      `}</style>
    </section>
  );
};

export default HeroClassic;