function MiniPreview({ evento, variant = "classic" }) {

  const fecha = new Date(evento.fecha);

  const fechaFormateada = fecha.toLocaleDateString("es-AR", {
    day: "numeric",
    month: "short"
  });

  const horaFormateada = fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  return (
    <div className="w-full h-full relative overflow-hidden rounded-[2rem]">

      {/* 🌄 FONDO */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/70"></div>

      {/* CONTENIDO */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-3 text-white">

        <p className="text-[10px] tracking-wide opacity-80 mb-1">
          {fechaFormateada} · {horaFormateada}
        </p>

        <h4 className="text-sm font-semibold leading-tight mb-1">
          {evento.nombre}
        </h4>

        <p className="text-[10px] opacity-80 mb-2">
          {evento.lugar}
        </p>

        <p className="text-[9px] italic opacity-70">
          {evento.mensaje_principal}
        </p>

      </div>

    </div>
  );
}

export default MiniPreview;