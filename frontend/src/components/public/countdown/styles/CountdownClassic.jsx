function CountdownClassic({ timeLeft }) {

  if (!timeLeft) {
    return (
      <section className="py-8 text-center bg-[#f8f5f2]">
        <h2 className="text-2xl font-serif tracking-wide text-gray-700">
          El evento ya comenzó
        </h2>
      </section>
    )
  }

  return (
    <section className="py-8 bg-[#f8f5f2] flex justify-center">

      <div className="max-w-xl w-full text-center px-6">

        {/* titulo */}
        <h2 className="text-xl font-serif tracking-[0.25em] text-gray-700 mb-12">
          FALTA MUY POCO
        </h2>

        {/* linea decorativa */}
        <div className="w-16 h-px bg-gray-300 mx-auto mb-8"></div>

        {/* contador */}
        <div className="flex justify-center gap-6">

          <TimeBox value={timeLeft.dias} label="DÍAS" />
          <TimeBox value={timeLeft.horas} label="HORAS" />
          <TimeBox value={timeLeft.minutos} label="MIN" />
          <TimeBox value={timeLeft.segundos} label="SEG" />

        </div>

        {/* linea inferior */}
        <div className="w-16 h-px bg-gray-300 mx-auto mt-12"></div>

      </div>

    </section>
  )
}


function TimeBox({ value, label }) {
  return (
    <div className="flex flex-col items-center">

      <div className="w-10 h-10 flex items-center justify-center
                      bg-white/70 backdrop-blur-sm
                      border border-gray-200
                      rounded-md
                      shadow-sm">

        <span className="text-2xl font-serif text-gray-800">
          {value}
        </span>

      </div>

      <span className="text-[10px] tracking-[0.3em] text-gray-500 mt-3">
        {label}
      </span>

    </div>
  )
}

export default CountdownClassic