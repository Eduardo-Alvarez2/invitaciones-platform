import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import Template from "../../templates/Template";
import { demoEventos } from "../../mocks/demoEventos";

/**
 * Componente DemoTemplate
 * Permite visualizar una plantilla específica y redirigir al editor 
 * público con el parámetro de diseño seleccionado.
 */
function DemoTemplate() {
  const { template } = useParams();
  const navigate = useNavigate();

  // Acceso a los datos del evento según el parámetro de la URL
  const evento = demoEventos ? demoEventos[template] : null;

  if (!evento) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 font-medium">Template no encontrado</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* BARRA SUPERIOR: Controles de navegación y acción */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/10">
        <button
          onClick={() => navigate("/")}
          className="text-white text-xs font-bold uppercase tracking-widest hover:opacity-70 transition-opacity"
        >
          ← Volver
        </button>

        <button
          onClick={() => navigate(`/editor?template=${template}`)}
          className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all shadow-xl active:scale-95"
        >
          Personalizar este diseño
        </button>
      </div>

      {/* RENDERIZADO DEL TEMPLATE SELECCIONADO */}
      <div className="w-full h-full">
        <Template evento={evento} />
      </div>
    </div>
  );
}

export default DemoTemplate;