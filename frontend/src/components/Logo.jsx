import React from 'react';

function Logo({ light = false }) {
  return (
    /* 🛡️ Agregamos translate="no" y la clase "notranslate" al contenedor principal */
    <div 
      translate="no" 
      className="notranslate flex flex-col items-center md:items-start select-none"
    >
      {/* Contenedor del Nombre */}
      <div 
        className="relative font-serif text-2xl md:text-3xl tracking-[0.1em] font-bold uppercase bg-gradient-to-r from-[#DFBA73] via-[#F5E1A4] to-[#C29B53] bg-clip-text text-transparent"
        style={{ fontFamily: "'Cinzel', serif" }}
      >
        {/* El símbolo de infinito arriba de la I */}
        <span className="absolute -top-4 left-[1px] text-[10px] md:text-[11px] tracking-normal font-sans bg-gradient-to-r from-[#DFBA73] to-[#C29B53] bg-clip-text text-transparent">
          ∞
        </span>
        Invitto
      </div>
      
      {/* Descripción abajo */}
      <span 
        className={`text-[8px] md:text-[9px] tracking-[0.25em] uppercase font-light mt-0.5 ${
          light ? 'text-gray-400' : 'text-[#DFBA73]/80'
        }`}
        style={{ fontFamily: "'Montserrat', sans-serif" }}
      >
        Invitaciones Digitales Premium
      </span>
    </div>
  );
}

export default Logo;