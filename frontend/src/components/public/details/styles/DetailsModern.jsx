import React from "react";

function DetailsModern({ lugar, direccion }) {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          
          {/* Decoración de fondo sutil */}
          <div className="absolute -inset-4 bg-indigo-50/50 rounded-[3rem] scale-95 opacity-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 -z-10"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12 border border-gray-100 p-10 md:p-16 rounded-[2.5rem] bg-white shadow-sm">
            
            {/* Columna Izquierda: El "Qué" */}
            <div className="space-y-4 text-center md:text-left max-w-sm">
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase tracking-[0.3em] rounded-full">
                Ubicación
              </span>
              <h3 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 uppercase leading-none">
                Ceremonia <br /> & Fiesta
              </h3>
            </div>

            {/* Columna Derecha: El "Dónde" */}
            <div className="flex flex-col items-center md:items-end text-center md:text-right space-y-6 flex-1">
              
              <div className="space-y-2">
                <p className="text-2xl font-bold text-gray-800 tracking-tight italic">
                  {lugar}
                </p>
                <div className="w-12 h-1 bg-indigo-600 ml-auto hidden md:block"></div>
              </div>

              <div className="space-y-1">
                <p className="text-gray-500 font-light text-lg leading-relaxed max-w-xs">
                  {direccion}
                </p>
                <span className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
                  Buenos Aires, Argentina
                </span>
              </div>

              {/* Icono decorativo de GPS minimalista */}
              <div className="pt-4">
                <div className="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetailsModern;