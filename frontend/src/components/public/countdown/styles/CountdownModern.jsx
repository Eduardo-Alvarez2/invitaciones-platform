import React from "react";

function CountdownModern({ timeLeft }) {
  if (!timeLeft) {
    return (
      <section className="py-16 text-center bg-white border-y border-gray-100">
        <h2 className="text-3xl font-light tracking-tighter text-gray-900 uppercase">
          El evento <span className="font-bold">ha comenzado</span>
        </h2>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white flex justify-center">
      <div className="max-w-4xl w-full px-6 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-6">
        
        {/* Título lateral o superior con estilo moderno */}
        <div className="text-center md:text-left space-y-2">
          <span className="text-indigo-600 text-xs font-bold uppercase tracking-[0.4em] block">
            Save the date
          </span>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase leading-none">
            Falta <br className="hidden md:block" /> muy poco
          </h2>
        </div>

        {/* Contenedor del contador */}
        <div className="flex items-baseline gap-4 md:gap-8">
          <TimeBox value={timeLeft.dias} label="días" />
          <Divider />
          <TimeBox value={timeLeft.horas} label="horas" />
          <Divider />
          <TimeBox value={timeLeft.minutos} label="minutos" />
          <Divider />
          <TimeBox value={timeLeft.segundos} label="segundos" />
        </div>
      </div>
    </section>
  );
}

function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center md:items-start group">
      {/* Valor numérico: Grande, Bold y San-Serif */}
      <span className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter transition-transform group-hover:scale-110 duration-300">
        {String(value).padStart(2, '0')}
      </span>
      {/* Label: Pequeño, minúscula y con color de acento */}
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-indigo-500 mt-1">
        {label}
      </span>
    </div>
  );
}

// Divisor vertical sutil entre números
function Divider() {
  return (
    <div className="h-10 w-px bg-gray-200 self-center opacity-50 hidden sm:block"></div>
  );
}

export default CountdownModern;