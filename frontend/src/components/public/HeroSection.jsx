function HeroSection({ titulo, mensaje, imagen }) {

  const background = imagen
    ? `url(http://localhost:5000/uploads/${imagen})`
    : "url(https://images.unsplash.com/photo-1519225421980-715cb0215aed)"

  return (
    <section
      className="relative min-h-screen flex items-center justify-center text-white text-center bg-cover bg-center"
      style={{ backgroundImage: background }}
    >

      {/* Overlay oscuro elegante */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Contenido */}
      <div className="relative z-10 max-w-3xl px-6">

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          {titulo}
        </h1>

        <p className="text-xl md:text-2xl opacity-90">
          {mensaje}
        </p>

      </div>

    </section>
  )
}

export default HeroSection
