import { useParams, useNavigate } from "react-router-dom";
import Template from "../../templates/Template";
import { demoEventos } from "../../mocks/demoEventos";

function DemoTemplate() {
  const { template } = useParams();
  const navigate = useNavigate();

  const evento = demoEventos[template];

  if (!evento) return <p>Template no encontrado</p>;

  return (
    <div className="relative">

      {/* 🔝 BARRA SUPERIOR */}
      <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-black/50 backdrop-blur-md">

        <button
          onClick={() => navigate("/")}
          className="text-white text-sm hover:underline"
        >
          ← Volver
        </button>

        <button
          onClick={() => navigate(`/crear-evento?template=${template}`)}
          className="bg-white text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
        >
          Usar este diseño
        </button>

      </div>

      {/* 👇 TEMPLATE REAL */}
      <Template evento={evento} />

    </div>
  );
}

export default DemoTemplate;