import { useRef, useState, useEffect } from "react"

function GalleryClassic({ imagenes = [] }) {
  const containerRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const container = containerRef.current

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const width = container.offsetWidth
      const index = Math.round(scrollLeft / width)
      setActiveIndex(index)
    }

    container.addEventListener("scroll", handleScroll)
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  if (!imagenes.length) return null

  return (
    <section className="py-20 bg-[#f8f5f2]">

      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-smooth"
      >
        {imagenes.map((img, index) => (
          <div
            key={index}
            className="w-full shrink-0 snap-center"
          >
            <div className="px-6">
              <div className="h-96 overflow-hidden rounded-md shadow-lg">
                <img
                  src={img}
                  alt={`galeria-${index}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Puntitos */}
      <div className="flex justify-center gap-2 mt-6">
        {imagenes.map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-neutral-800 scale-110" : "bg-neutral-400 opacity-40"}`}
          />
        ))}
      </div>

    </section>
  )
}

export default GalleryClassic