import HeroSection from "../components/public/hero/HeroSection"
import CountdownSection from "../components/public/countdown/CountdownSection"
import DetailsSection from "../components/public/details/DetailsSection"
import MapSection from "../components/public/MapSection"
import GallerySection from "../components/public/gallery/GallerySection"
import RSVPSection from "../components/public/RSVPSection"
import CronogramaSection from "../components/public/cronograma/CronogramaSection"
import MusicPlayer from "../components/public/countdown/MusicPlayer"

function Template({ evento }) {

  const variant = evento.template || "classic"
  const imagenes = evento.imagenes 

  return (
    <div className="relative w-full">

      <HeroSection
        titulo={evento.nombre}
        mensaje={evento.mensaje_principal}
        imagen={evento.imagen_portada}
        variant={variant}
      />

      <CountdownSection
        fecha={evento.fecha}
        variant={variant}
      />

      <DetailsSection
        lugar={evento.lugar}
        direccion={evento.direccion}
        variant={variant}
      />

      <CronogramaSection
        items={evento.cronograma}
        variant={variant}
      />

      <GallerySection
        imagenes={evento.imagenes}
        variant={variant}
      />

      <MapSection
        direccion={evento.direccion}
        variant={variant}
      />

      <RSVPSection
        slug={evento.slug}
        variant={variant}
      />
      <MusicPlayer urlCancion={evento.cancion} />

    </div>
  )
}

export default Template