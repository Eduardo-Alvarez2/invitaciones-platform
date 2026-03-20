import HeroSection from "../../components/public/HeroSection"
import CountdownSection from "../../components/public/countdown/CountdownSection"
import DetailsSection from "../../components/public/details/DetailsSection"
import MapSection from "../../components/public/MapSection"
import GallerySection from "../../components/public/gallery/GallerySection"
import RSVPSection from "../../components/public/RSVPSection"
import CronogramaSection from "../../components/public/cronograma/CronogramaSection"  

function ClassicTemplate({ evento }) {

  const imagenesDemo = [
    "https://images.unsplash.com/photo-1519741497674-611481863552",
    "https://images.unsplash.com/photo-1522673607200-164d1b6ce486",
    "https://images.unsplash.com/photo-1511285560929-80b456fea0bc"
  ]

  return (
    <div>

      <HeroSection
        titulo={evento.nombre}
        mensaje={evento.mensaje_principal}
        imagen={evento.imagen_portada}
      />

      <CountdownSection
        fecha={evento.fecha}
        variant="classic"
      />

      <DetailsSection
        lugar={evento.lugar}
        direccion={evento.direccion}
        variant="classic"
      />

      <CronogramaSection
         items={evento.cronograma}
         variant="classic"
      />

      <GallerySection imagenes={imagenesDemo} />

      <MapSection direccion={evento.direccion} />

      <RSVPSection slug={evento.slug} />

    </div>
  )
}

export default ClassicTemplate