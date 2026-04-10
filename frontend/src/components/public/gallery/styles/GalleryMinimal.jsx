import React, { useState } from "react";

/**
 * Componente de Galería (Minimal)
 * Diseño editorial con grid balanceado y transiciones suaves.
 */
function GalleryMinimal({ imagenes = [] }) {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!imagenes.length) return null;

  return (
    <section className="py-32 bg-white px-6 border-t border-gray-50">
      <div className="max-w-5xl mx-auto">
        
        {/* Encabezado Minimalista */}
        <div className="text-center mb-24 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.6em] text-gray-300 font-light block">
            Visuales
          </span>
          <h2 className="text-4xl font-serif font-light text-gray-800 italic">
            Galería de Momentos
          </h2>
          <div className="w-8 h-[1px] bg-gray-100 mx-auto mt-8"></div>
        </div>

        {/* Grid Minimalista: Bordes rectos y proporciones elegantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imagenes.map((img, index) => (
            <div
              key={index}
              onClick={() => setSelectedImg(img)}
              className={`
                relative overflow-hidden bg-gray-50 cursor-pointer group aspect-[4/5]
                ${index % 4 === 0 ? "md:col-span-2 md:aspect-video" : ""}
              `}
            >
              <img
                src={img}
                alt={`galeria-${index}`}
                className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 ease-out"
              />
              
              {/* Overlay minimalista al hover */}
              <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Indicador de expansión pequeño */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="w-8 h-8 rounded-full border border-white/40 backdrop-blur-sm flex items-center justify-center text-white">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Minimalista (Fondo Blanco) */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-white/98 flex items-center justify-center p-8 backdrop-blur-md"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-12 right-12 text-gray-400 hover:text-gray-800 transition-colors">
            <span className="text-[10px] uppercase tracking-widest font-light">Cerrar</span>
          </button>
          <img 
            src={selectedImg} 
            className="max-w-full max-h-[80vh] object-contain shadow-[0_40px_100px_rgba(0,0,0,0.03)]"
            alt="Vista previa"
          />
        </div>
      )}
    </section>
  );
}

export default GalleryMinimal;