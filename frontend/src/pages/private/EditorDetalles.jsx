import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createEvento, uploadPortada, getEventoById } from "../../services/EventService";
import axios from "axios";
import { 
  ArrowLeft, Loader2, Plus, Trash2, 
  UploadCloud, Calendar, MapPin, Type, Image as ImageIcon, Clock 
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function EditorDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [stepMsg, setStepMsg] = useState("");
  
  // 🎯 Estado para capturar los errores por campo específico
  const [errors, setErrors] = useState({});

  const [imagenPortada, setImagenPortada] = useState(null);
  const [previewPortada, setPreviewPortada] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [galeriaExistente, setGaleriaExistente] = useState([]);

  const [cronograma, setCronograma] = useState([
    { hora: "", titulo: "", descripcion: "" }
  ]);

  const [form, setForm] = useState({
    nombre: "", fecha: "", lugar: "", direccion: "", mensaje_principal: "", template: "modern"
  });

  useEffect(() => {
    const cargarDatos = async () => {
      if (id) {
        try {
          setLoading(true);
          setErrors({});
          const data = await getEventoById(id);
          const fechaFormateada = data.fecha ? data.fecha.substring(0, 16) : "";

          setForm({
            nombre: data.nombre || "",
            fecha: fechaFormateada,
            lugar: data.lugar || "",
            direccion: data.direccion || "",
            mensaje_principal: data.mensaje_principal || "",
            template: data.template || "modern"
          });

          if (data.imagen_portada) { 
            setPreviewPortada(`${API_URL.replace('/api', '')}${data.imagen_portada}`);
          }

          if (data.cronograma) setCronograma(data.cronograma);
          if (data.imagenes) setGaleriaExistente(data.imagenes);

        } catch (error) {
          console.error("Error al cargar datos:", error);
          setErrors({ global: "No se pudieron cargar los datos de la invitación." });
        } finally {
          setLoading(false);
        }
      }
    };
    cargarDatos();
  }, [id]);

  // ✏️ Limpia el error del campo apenas el usuario empieza a escribir de nuevo
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCronogramaChange = (index, field, value) => {
    const newCron = [...cronograma];
    newCron[index][field] = value;
    setCronograma(newCron);
  };
  
  const addCronogramaItem = () => setCronograma([...cronograma, { hora: "", titulo: "", descripcion: "" }]);
  
  const handlePortadaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenPortada(file);
      setPreviewPortada(URL.createObjectURL(file));
      if (errors.portada) setErrors(prev => ({ ...prev, portada: "" }));
    }
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files);
    setGaleria(prev => [...prev, ...files].slice(0, 3 - galeriaExistente.length));
  };

  const removeImagenNueva = (index) => {
    setGaleria(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({}); // Limpiar errores previos para evitar bloqueos visuales
    const token = localStorage.getItem("token");

    try {
      let eventoId = id;
      let yaPagado = false;

      if (id) {
        setStepMsg("Actualizando...");
        const res = await axios.put(`${API_URL}/eventos/${id}`, form, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        yaPagado = res.data?.pagado || false;
      } else {
        setStepMsg("Creando...");
        const response = await createEvento(form);
    
        console.log("Datos recibidos del backend:", response);

        eventoId = response?.id || response?.data?.id || response?.evento?.id;

        if (!eventoId) {
          throw new Error("No se pudo obtener el ID del evento creado");
        }
        yaPagado = false;
      }

      // Subida de Portada
      if (eventoId && imagenPortada) {
        setStepMsg("Subiendo portada...");
        await uploadPortada(eventoId, imagenPortada);
      }

      // Subida de Galería
      if (eventoId && galeria.length > 0) {
        setStepMsg("Subiendo galería...");
        for (let img of galeria) {
          const fd = new FormData();
          fd.append("file", img);
          await axios.post(`${API_URL}/eventos/${eventoId}/imagenes`, fd, { 
            headers: { Authorization: `Bearer ${token}` } 
          });
        }
      }

      // Sincronización del Cronograma
      if (eventoId) {
        setStepMsg("Sincronizando cronograma...");
        await axios.post(`${API_URL}/eventos/${eventoId}/cronograma/sync`, 
          { items: cronograma }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Redirección final segura
        if (yaPagado) {
          navigate(`/dashboard/evento/${eventoId}`);
        } else {
          navigate(`/checkout/${eventoId}`);
        }
      }

    } catch (error) {
      console.error("Error en el proceso de guardado:", error);
  
      if (error.response && error.response.status === 400) {
      const backendData = error.response.data;
    
      // Si viene el mapeo directo de errores del Schema, lo seteamos directo
      if (typeof backendData === "object" && !backendData.error && !backendData.message) {
      setErrors(backendData); 
      } else {
      // Si viene un string general de Flask
      setErrors({ global: backendData.error || backendData.message || "Error al validar los datos." });
      }
       } else {
         setErrors({ global: error.response?.data?.error || "Error de conexión con el servidor. Inténtalo de nuevo." });
       }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) => `w-full p-3.5 bg-gray-50/50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all ${
    errors[fieldName] ? "border-red-400 bg-red-50/30 focus:ring-red-400" : "border-gray-200"
  }`;

  // Mini-componente interno para no repetir código de los labels de error
  const ErrorLabel = ({ field }) => errors[field] ? (
    <p className="text-xs text-red-500 font-semibold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-150">
      ⚠️ {errors[field]}
    </p>
  ) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {id ? "Refinar Invitación" : "Crear Experiencia"}
          </h1>
        </div>

        {/* Error Global (Por si explota algo ajeno a los campos) */}
        {errors.global && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium">
            💥 {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SECCIÓN 1: DATOS */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg"><Type className="text-indigo-600" size={20} /></div>
              <h2 className="text-xl font-bold text-gray-800">Información</h2>
            </div>
            <div className="space-y-4">
              <div>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del Evento" className={inputClass("nombre")} />
                <ErrorLabel field="nombre" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} className={inputClass("fecha")} />
                  <ErrorLabel field="fecha" />
                </div>
                <div>
                  <input name="lugar" value={form.lugar} onChange={handleChange} placeholder="Lugar" className={inputClass("lugar")} />
                  <ErrorLabel field="lugar" />
                </div>
              </div>
              
              <div>
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección Exacta" className={inputClass("direccion")} />
                <ErrorLabel field="direccion" />
              </div>

              <div>
                <textarea name="mensaje_principal" value={form.mensaje_principal} onChange={handleChange} placeholder="Un mensaje cálido para tus invitados..." className={`${inputClass("mensaje_principal")} h-32 resize-none`} />
                <ErrorLabel field="mensaje_principal" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: CRONOGRAMA */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg"><Clock className="text-amber-600" size={20} /></div>
                <h2 className="text-xl font-bold text-gray-800">Cronograma</h2>
              </div>
              <button type="button" onClick={addCronogramaItem} className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700">
                <Plus size={18} /> Agregar paso
              </button>
            </div>
            <div className="space-y-4">
              {cronograma.map((item, index) => (
                <div key={index} className="flex gap-4 p-4 bg-gray-50/50 rounded-2xl border border-gray-100 items-start group">
                  <input type="time" value={item.hora} onChange={(e) => handleCronogramaChange(index, "hora", e.target.value)} className="p-2 rounded-xl border-gray-200 text-sm font-medium" />
                  <div className="flex-1 space-y-2">
                    <input placeholder="Título (ej: Recepción)" value={item.titulo} onChange={(e) => handleCronogramaChange(index, "titulo", e.target.value)} className="w-full bg-transparent font-bold text-gray-800 outline-none" />
                    <input placeholder="Breve detalle..." value={item.descripcion} onChange={(e) => handleCronogramaChange(index, "descripcion", e.target.value)} className="w-full bg-transparent text-sm text-gray-500 outline-none" />
                  </div>
                  <button type="button" onClick={() => setCronograma(cronograma.filter((_, i) => i !== index))} className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:text-red-600 transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 3: FOTOS */}
          <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg"><ImageIcon className="text-emerald-600" size={20} /></div>
              <h2 className="text-xl font-bold text-gray-800">Multimedia</h2>
            </div>
            
            {/* Portada */}
            <div className="mb-8">
              <p className="text-sm font-bold text-gray-700 mb-3">Portada Principal</p>
              <div className={`relative overflow-hidden rounded-3xl border-2 border-dashed transition-colors ${
                errors.portada ? "border-red-300 bg-red-50/10" : "border-gray-200 hover:border-indigo-400"
              }`}>
                {previewPortada ? (
                  <div className="relative h-56">
                    <img src={previewPortada} className="w-full h-full object-cover" alt="Preview" />
                    <button type="button" onClick={() => {setImagenPortada(null); setPreviewPortada(null);}} className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-xl text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center h-40 cursor-pointer">
                    <UploadCloud size={32} className="text-indigo-500 mb-2" />
                    <span className="text-sm font-medium text-gray-500">Subir foto de impacto</span>
                    <input type="file" className="hidden" onChange={handlePortadaChange} />
                  </label>
                )}
              </div>
              <ErrorLabel field="portada" />
            </div>

            {/* Galería */}
            <div>
              <p className="text-sm font-bold text-gray-700 mb-3">Galería de Momentos (Máx 3)</p>
              <div className="grid grid-cols-4 gap-4">
                {galeriaExistente.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img src={`${API_URL.replace('/api', '')}${img.url}`} className="w-full h-full object-cover opacity-80" alt="Old" />
                  </div>
                ))}
                {galeria.map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl overflow-hidden border-2 border-indigo-500 relative">
                    <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="New" />
                    <button type="button" onClick={() => removeImagenNueva(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><Trash2 size={10}/></button>
                  </div>
                ))}
                {(galeria.length + galeriaExistente.length) < 3 && (
                  <label className="aspect-square flex items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:bg-gray-50 transition-all">
                    <Plus className="text-gray-400" />
                    <input type="file" multiple className="hidden" onChange={handleGaleriaChange} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN */}
          <button disabled={loading} className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg shadow-2xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3">
            {loading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>{stepMsg}</span>
              </>
            ) : (
              id ? "Guardar cambios" : "Crear Invitación"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditorDetalle;