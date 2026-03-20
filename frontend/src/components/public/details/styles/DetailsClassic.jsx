function DetailsClassic({ lugar, direccion }) {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-md mx-auto text-center px-6">

        <p className="text-[11px] tracking-[0.35em] text-gray-400 mb-3">
          CEREMONIA & RECEPCIÓN
        </p>

        <h3 className="text-xl font-serif text-gray-800 mb-4">
          {lugar}
        </h3>

        <p className="text-sm text-gray-600">
          {direccion}
        </p>

      </div>
    </section>
  )
}

export default DetailsClassic