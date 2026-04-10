import React from "react";

function CountdownMinimal({ timeLeft }) {
  if (!timeLeft) {
    return (
      <section className="py-20 text-center bg-white italic font-serif text-gray-400 tracking-widest">
        El momento ha llegado.
      </section>
    );
  }

  return (
    <section className="py-32 bg-white flex flex-col items-center">
      {/* Título: Muy pequeño, centrado y con mucho espacio entre letras */}
      <div className="mb-16 text-center">
        <span className="text-[10px] uppercase tracking-[0.6em] text-gray-300 font-light">
          Cuenta Regresiva
        </span>
      </div>

      {/* Contenedor del contador: Sin bordes, sin sombras, solo números elegantes */}
      <div className="flex items-center gap-8 md:gap-16">
        <TimeBox value={timeLeft.dias} label="días" />
        <TimeBox value={timeLeft.horas} label="hs" />
        <TimeBox value={timeLeft.minutos} label="min" />
        <TimeBox value={timeLeft.segundos} label="seg" />
      </div>

      {/* Una línea decorativa extremadamente fina al final */}
      <div className="mt-20 w-px h-16 bg-gradient-to-b from-gray-200 to-transparent"></div>
    </section>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">
      {/* Valor numérico: Usamos una Serif elegante y un peso ligero (font-light) */}
      <span className="text-4xl md:text-6xl font-serif font-light text-gray-800 tracking-tighter">
        {String(value).padStart(2, '0')}
      </span>
      {/* Label: Minúsculo, gris muy claro, debajo del número */}
      <span className="text-[9px] uppercase tracking-[0.3em] text-gray-400 mt-3 font-light">
        {label}
      </span>
    </div>
  );
}

export default CountdownMinimal;