import React from "react";

function MapSection({ direccion }) {
  if (!direccion) return null;

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`;

  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Cabecera del Mapa */}
        <div className="text-center mb-12 space-y-4">
          <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.5em]">
            Ubicación
          </span>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">
            Cómo llegar
          </h2>
          <div className="w-10 h-1 bg-gray-900 mx-auto"></div>
        </div>

        {/* Contenedor del Mapa con estilo Premium */}
        <div className="relative group">
          {/* Sombras decorativas de fondo */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
          
          <div className="relative overflow-hidden rounded-[2rem] bg-white shadow-2xl ring-1 ring-gray-100">
            <iframe
              title="Mapa del evento"
              src={mapUrl}
              width="100%"
              height="450"
              loading="lazy"
              style={{ border: 0, filter: 'grayscale(10%) contrast(1.1)' }}
              className="w-full h-[400px] md:h-[450px]"
            />

            {/* Overlay inferior con la dirección y botón */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row items-center justify-between gap-4 p-6 bg-white/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Dirección del evento</p>
                  <p className="text-sm font-bold text-gray-800 leading-tight">{direccion}</p>
                </div>
              </div>

              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full md:w-auto px-8 py-3 bg-gray-900 text-white text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl shadow-gray-900/10 text-center"
              >
                Abrir en GPS
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

export default MapSection;