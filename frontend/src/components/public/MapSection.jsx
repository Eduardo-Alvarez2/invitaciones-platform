function MapSection({ direccion }) {
  if (!direccion) return null

  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(direccion)}&output=embed`
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(direccion)}`

  return (
    <section className="py-24 bg-white">

      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-3xl font-light tracking-wide mb-10">
          Cómo llegar
        </h2>

        <div className="overflow-hidden rounded-2xl shadow-xl">
          <iframe
            title="Mapa del evento"
            src={mapUrl}
            width="100%"
            height="400"
            loading="lazy"
            style={{ border: 0 }}
          />
        </div>

        <p className="mt-8 text-neutral-600 text-sm tracking-wide">
          {direccion}
        </p>

        <div className="mt-6">
          <a
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm tracking-wider border-b border-neutral-800 hover:opacity-60 transition"
          >
            Ver en Google Maps
          </a>
        </div>

      </div>

    </section>
  )
}

export default MapSection