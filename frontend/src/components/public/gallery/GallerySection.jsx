import GalleryClassic from "./styles/GalleryClassic"
import GalleryModern from "./styles/GalleryModern"

function GallerySection({ imagenes = [], variant = "classic" }) {
  if (!imagenes.length) return null

  switch (variant) {
    case "classic":
      return <GalleryClassic imagenes={imagenes} />
    case "modern":
      return <GalleryModern imagenes={imagenes} />
    default:
      return <GalleryClassic imagenes={imagenes} />
  }
}

export default GallerySection