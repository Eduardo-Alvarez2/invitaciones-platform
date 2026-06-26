import React, { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react"; // Usamos Lucide para los iconos

function MusicPlayer({ urlCancion }) {
  // Si no hay canción cargada en el evento, no renderizamos nada
  if (!urlCancion) return null;

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Control de reproducción
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => {
        console.log("Error al reproducir el audio: ", err);
      });
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Elemento HTML de Audio invisible */}
      <audio ref={audioRef} src={urlCancion} loop />

      {/* Botón Flotante Estilizado */}
      <button
        onClick={togglePlay}
        className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg backdrop-blur-md transition-all duration-300 border active:scale-95 group ${
          isPlaying
            ? "bg-indigo-600/90 text-white border-indigo-500 animate-pulse"
            : "bg-white/80 text-gray-700 border-gray-200 hover:bg-white"
        }`}
        title={isPlaying ? "Pausar música" : "Reproducir música"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
        ) : (
          <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" />
        )}
      </button>
    </div>
  );
}

export default MusicPlayer;