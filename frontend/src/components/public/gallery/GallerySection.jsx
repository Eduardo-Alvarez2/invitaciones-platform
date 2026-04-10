import GalleryClassic from "./styles/GalleryClassic"
import GalleryModern from "./styles/GalleryModern"
import GalleryMinimal from "./styles/GalleryMinimal"

function GallerySection({ imagenes = [], variant = "classic" }) {
  if (!imagenes.length) return null

  switch (variant) {
    case "classic":
      return <GalleryClassic imagenes={imagenes} />
    case "modern":
      return <GalleryModern imagenes={imagenes} />
    case "minimal":
      return <GalleryMinimal imagenes={imagenes} />
    default:
      return <GalleryClassic imagenes={imagenes} />
  }
}

export default GallerySection