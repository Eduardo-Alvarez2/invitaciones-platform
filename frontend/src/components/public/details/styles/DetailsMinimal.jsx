import React from "react";

function DetailsMinimal({ lugar, direccion }) {
  return (
    <section className="py-32 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-16 md:gap-24 text-center md:text-left">
          
          {/* Columna Izquierda: El Concepto */}
          <div className="space-y-6 flex-1">
            <span className="text-[10px] uppercase tracking-[0.5em] text-gray-300 font-light block">
              Ubicación
            </span>
            <h3 className="text-4xl md:text-5xl font-serif font-light text-gray-800 italic leading-tight">
              Ceremonia <br /> & Celebración
            </h3>
            {/* Divisor minimalista: una línea casi invisible */}
            <div className="w-12 h-px bg-gray-100 mx-auto md:ml-0"></div>
          </div>

          {/* Columna Derecha: La Información */}
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <p className="text-2xl font-serif text-gray-700 tracking-tight leading-snug">
                {lugar}
              </p>
              <div className="space-y-1">
                <p className="text-gray-400 font-light text-base tracking-wide leading-relaxed">
                  {direccion}
                </p>
                <span className="text-[10px] text-gray-200 uppercase tracking-[0.3em] block pt-2">
                  Buenos Aires, Argentina
                </span>
              </div>
            </div>

            {/* Icono: Reducimos el trazo (strokeWidth) y eliminamos el fondo de color */}
            <div className="flex justify-center md:justify-start">
              <div className="w-10 h-10 rounded-full border border-gray-50 flex items-center justify-center text-gray-300">
                <svg 
                  className="w-4 h-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1" 
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" 
                  />
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1" 
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                  />
                </svg>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default DetailsMinimal;