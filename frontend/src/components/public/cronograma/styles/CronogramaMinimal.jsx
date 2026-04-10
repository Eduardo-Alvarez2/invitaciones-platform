import React from "react";

function CronogramaMinimal({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="py-32 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Encabezado Minimalista */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-gray-300 font-light block">
            Itinerario
          </span>
          <h2 className="text-4xl font-serif font-light text-gray-800 italic">
            Momentos del Evento
          </h2>
          <div className="w-8 h-[1px] bg-gray-100 mx-auto mt-8"></div>
        </div>

        {/* Lista de Items: Línea de tiempo sutil */}
        <div className="relative border-l border-gray-100 ml-4 md:ml-0 space-y-16">
          {items.map((item, index) => (
            <div 
              key={item.id || index} 
              className="relative pl-10 md:grid md:grid-cols-12 md:gap-8 items-start group"
            >
              {/* Punto indicador de la línea de tiempo */}
              <div className="absolute -left-[5px] top-2 w-[9px] h-[9px] rounded-full bg-white border border-gray-200 group-hover:bg-gray-800 group-hover:border-gray-800 transition-colors duration-500"></div>

              {/* Hora: A la izquierda en desktop, arriba en mobile */}
              <div className="md:col-span-3">
                <span className="text-sm font-light text-gray-400 tracking-[0.2em] uppercase">
                  {item.hora}
                </span>
              </div>

              {/* Contenido: Serif y elegante */}
              <div className="md:col-span-9 mt-2 md:mt-0 space-y-2">
                <h3 className="text-xl font-serif font-light text-gray-800 tracking-tight">
                  {item.titulo}
                </h3>
                {item.descripcion && (
                  <p className="text-gray-400 text-sm leading-relaxed font-light tracking-wide max-w-lg">
                    {item.descripcion}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Cierre decorativo */}
        <div className="mt-24 text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-gray-200">
            Los horarios son aproximados
          </p>
        </div>

      </div>
    </section>
  );
}

export default CronogramaMinimal;