import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getEventoBySlug } from "../../services/EventService";
import Template from "../../templates/Template";

// ✅ Detecta si estamos en Producción (invitto.cloud) o Desarrollo (localhost)
const API_BASE = import.meta.env.PROD 
  ? "https://invitto.cloud" 
  : "http://localhost:5000"; 

function InvitacionPublica() {
  const { slug } = useParams();
  const [evento, setEvento] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const data = await getEventoBySlug(slug);
        console.log("1. Datos crudos recibidos:", data);
        
        // Sincronizamos y forzamos URLs absolutas
        const eventoFormateado = {
          ...data,
          // Portada: Nos aseguramos de que la ruta use "/" y tenga el API_BASE
          imagen_portada: data.foto_portada 
            ? `${API_BASE}${data.foto_portada.replace(/\\/g, '/')}` 
            : null,
          
          // Galería: Mapeamos los objetos a un array de strings (URLs completas)
          imagenes: data.imagenes?.map(img => 
            `${API_BASE}${img.url.replace(/\\/g, '/')}`
          ) || [],
          
          // Cronograma: Aseguramos que sea un array
          cronograma: data.cronograma || []
        };

        console.log("2. URL de portada generada:", eventoFormateado.imagen_portada);
        console.log("3. Array de imágenes galería:", eventoFormateado.imagenes);
        
        setEvento(eventoFormateado);
      } catch (error) {
        console.error("Error al cargar invitación:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvento();
  }, [slug]);

  if (loading) return <div className="p-20 text-center">Cargando...</div>;
  if (!evento) return <div className="p-20 text-center">No se encontró el evento.</div>;

  return <Template evento={evento} />;
}

export default InvitacionPublica;