import HeroClassic from "./styles/HeroClassic";
import HeroModern from "./styles/HeroModern";
import HeroMinimal from "./styles/HeroMinimal";

/**
 * HeroSection (Lógica de Orquestación)
 * Centraliza datos y decide qué variante renderizar.
 */
function HeroSection({ titulo, mensaje, imagen, variant = "modern" }) {

  /**
   * Procesa correctamente cualquier tipo de imagen:
   * - blob (preview local)
   * - http/https (externa)
   * - /ruta local frontend
   * - nombre de archivo backend
   */
  const getImagePath = (img) => {
    if (!img) {
      return "https://images.unsplash.com/photo-1519225421980-715cb0215aed";
    }

    // 🔥 soporta blob, http y https
    if (/^(http|https|blob):/.test(img)) {
      return img;
    }

    // rutas locales del frontend
    if (img.startsWith("/")) {
      return img;
    }

    // fallback: backend
    return `http://localhost:5000/uploads/${img}`;
  };

  const props = {
    titulo,
    mensaje,
    imagen: getImagePath(imagen),
  };

  // Render según variante
  switch (variant) {
    case "classic":
      return <HeroClassic {...props} />;

    case "modern":
      return <HeroModern {...props} />;

    case "minimal":
      return <HeroMinimal {...props} />;

    default:
      return <HeroModern {...props} />;
  }
}

export default HeroSection;