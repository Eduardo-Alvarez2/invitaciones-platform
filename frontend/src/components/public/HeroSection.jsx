import React from "react";

function HeroSection({ titulo, mensaje, imagen, variant = "modern" }) {
  // Lógica inteligente para la ruta de la imagen
  const getImagePath = (img) => {
    if (!img) return "https://images.unsplash.com/photo-1519225421980-715cb0215aed";
    // Si la imagen empieza con http o con / (carpeta public del frontend), se usa directo
    if (img.startsWith("http") || img.startsWith("/")) return img;
    // Si es solo un nombre de archivo, se asume que viene del backend uploads
    return `http://localhost:5000/uploads/${img}`;
  };

  const background = `url(${getImagePath(imagen)})`;

  return (
    <section
      className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center text-white overflow-hidden bg-gray-900"
    >
      {/* Fondo con imagen y zoom suave */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-110"
        style={{ backgroundImage: background }}
      />

      {/* Overlay Dinámico: Gradiente para asegurar legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-black/70 z-10"></div>

      {/* Contenido */}
      <div className="relative z-20 max-w-5xl px-6 text-center">
        <div className="space-y-6 animate-fade-in">
          
          {/* Tag decorativo versátil (Cambiado de "Nuestra Historia") */}
          <span className="inline-block text-[10px] md:text-xs uppercase tracking-[0.5em] text-white/80 mb-4 border-b border-white/20 pb-2 font-bold">
            Estás Invitado
          </span>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase italic">
            {titulo}
          </h1>

          <div className="w-12 h-1 bg-indigo-500 mx-auto my-8"></div>

          <p className="text-lg md:text-2xl font-light max-w-2xl mx-auto leading-relaxed text-white/90 tracking-wide">
            {mensaje}
          </p>
        </div>
      </div>

      {/* Elemento decorativo: Flecha indicadora de scroll */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce opacity-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;