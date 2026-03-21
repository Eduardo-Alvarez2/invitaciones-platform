import React from "react";

function CronogramaModern({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-24 bg-[#fafafa]">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Encabezado Moderno */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div className="space-y-2">
            <span className="text-indigo-600 text-xs font-black uppercase tracking-[0.4em]">
              Timeline
            </span>
            <h2 className="text-5xl font-black tracking-tighter text-gray-900 uppercase">
              Itinerario
            </h2>
          </div>
          <div className="hidden md:block h-px flex-1 bg-gray-200 mx-10 mb-3"></div>
          <p className="text-gray-400 text-sm font-light uppercase tracking-widest">
            {items.length} Momentos clave
          </p>
        </div>

        {/* Lista de Items */}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item, index) => (
            <div 
              key={item.id} 
              className="group relative flex flex-col md:flex-row items-center bg-white border border-gray-100 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1"
            >
              {/* Número de orden sutil */}
              <span className="absolute top-4 right-6 text-4xl font-black text-gray-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                0{index + 1}
              </span>

              {/* Hora Destacada */}
              <div className="md:w-32 mb-4 md:mb-0">
                <span className="text-3xl font-black text-indigo-600 tracking-tighter">
                  {item.hora}
                </span>
                <div className="w-6 h-1 bg-gray-900 mt-1 hidden md:block transition-all group-hover:w-12"></div>
              </div>

              {/* Contenido */}
              <div className="flex-1 md:border-l md:border-gray-100 md:pl-10 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 uppercase tracking-tight">
                  {item.titulo}
                </h3>
                {item.descripcion && (
                  <p className="text-gray-500 mt-2 text-sm leading-relaxed font-light max-w-md">
                    {item.descripcion}
                  </p>
                )}
              </div>
              
              {/* Indicador lateral de acento */}
              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-indigo-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r-full"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CronogramaModern;