import HeroSection from "../components/public/HeroSection"
import CountdownSection from "../components/public/countdown/CountdownSection"
import DetailsSection from "../components/public/details/DetailsSection"
import MapSection from "../components/public/MapSection"
import GallerySection from "../components/public/gallery/GallerySection"
import RSVPSection from "../components/public/RSVPSection"
import CronogramaSection from "../components/public/cronograma/CronogramaSection"

function Template({ evento }) {

  const variant = evento.template || "classic"
  const imagenes = evento.imagenes 

  return (
    <div>

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
        imagenes={imagenes}
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

    </div>
  )
}

export default Template