import { useState } from "react";

function GalleryModern({ imagenes = [] }) {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!imagenes.length) return null;

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Encabezado de sección con estilo moderno */}
        <div className="mb-16 space-y-2">
          <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] block">
            Nuestros Momentos
          </span>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">
            Galería
          </h2>
        </div>

        {/* Grid Asimétrico (Masonry-like) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]">
          {imagenes.map((img, index) => {
            // Patrón de diseño asimétrico basado en el índice
            const isLarge = index === 0 || index === 7;
            const isTall = index === 1 || index === 4 || index === 6;
            const isWide = index === 3;

            return (
              <div
                key={index}
                onClick={() => setSelectedImg(img)}
                className={`
                  relative overflow-hidden rounded-[2rem] bg-gray-100 cursor-pointer group
                  ${isLarge ? "col-span-2 row-span-2" : ""}
                  ${isTall ? "row-span-2" : ""}
                  ${isWide ? "col-span-2" : ""}
                `}
              >
                {/* Imagen con zoom al hover */}
                <img
                  src={img}
                  alt={`galeria-${index}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay sutil al hover */}
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center scale-90 group-hover:scale-100 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal / Lightbox simple al hacer click */}
      {selectedImg && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedImg(null)}
        >
          <button className="absolute top-8 right-8 text-white hover:rotate-90 transition-transform">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <img 
            src={selectedImg} 
            className="max-w-full max-h-[85vh] rounded-xl shadow-2xl"
            alt="Vista previa"
          />
        </div>
      )}
    </section>
  );
}

export default GalleryModern;