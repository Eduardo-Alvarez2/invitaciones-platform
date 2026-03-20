import GalleryClassic from "./styles/GalleryClassic"

function GallerySection({ imagenes = [], variant = "classic" }) {
  if (!imagenes.length) return null

  switch (variant) {
    case "classic":
      return <GalleryClassic imagenes={imagenes} />
    default:
      return <GalleryClassic imagenes={imagenes} />
  }
}

export default GallerySection