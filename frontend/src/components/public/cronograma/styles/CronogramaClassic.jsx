function CronogramaClassic({ items }) {

  if (!items || items.length === 0) {
    return null
  }

  return (
    <section className="py-24 bg-white">

      <div className="max-w-3xl mx-auto px-6">

        {/* Título */}
        <div className="text-center mb-16">

          <h2 className="text-4xl font-light tracking-wide text-gray-800">
            Cronograma
          </h2>

          <div className="w-16 h-px bg-gray-300 mx-auto mt-4"></div>

        </div>

        {/* Timeline */}
        <div className="relative">

          {/* Línea central */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gray-200"></div>

          <div className="space-y-12">

            {items.map((item) => (

              <div key={item.id} className="relative flex items-start gap-6">

                {/* Punto timeline */}
                <div className="relative z-10 flex items-center justify-center w-4 h-4 mt-2 bg-gray-700 rounded-full"></div>

                {/* Hora */}
                <div className="w-20 text-sm text-gray-500 font-medium">
                  {item.hora}
                </div>

                {/* Contenido */}
                <div className="flex-1">

                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.titulo}
                  </h3>

                  {item.descripcion && (
                    <p className="text-gray-600 mt-1 text-sm leading-relaxed">
                      {item.descripcion}
                    </p>
                  )}

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  )
}

export default CronogramaClassic