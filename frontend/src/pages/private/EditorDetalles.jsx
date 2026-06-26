import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  createEvento, 
  uploadPortada, 
  getEventoById, 
  uploadGaleria, 
  syncCronograma, 
  uploadMusica 
} from "../../services/EventService";
import { 
  ArrowLeft, Loader2, Plus, Trash2, 
  UploadCloud, Calendar, MapPin, Type, Image as ImageIcon, Clock, Music 
} from "lucide-react";

// Usamos la IP de red local para que el celular resuelva bien las imágenes estáticas del backend
const API_URL = "http://192.168.1.5:5000/api";

function EditorDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [stepMsg, setStepMsg] = useState("");
  const [errors, setErrors] = useState({});

  const [imagenPortada, setImagenPortada] = useState(null);
  const [previewPortada, setPreviewPortada] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [galeriaExistente, setGaleriaExistente] = useState([]);
  
  const [cancion, setCancion] = useState(null);
  const [previewCancion, setPreviewCancion] = useState(null);

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

          if (data.cancion_url) {
            setPreviewCancion(`${API_URL.replace('/api', '')}${data.cancion_url}`);
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

  const handleCancionChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCancion(file);
      setPreviewCancion(URL.createObjectURL(file));
      if (errors.cancion) setErrors(prev => ({ ...prev, cancion: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      let eventoId = id;
      let yaPagado = false;

      // 1. Crear o Actualizar Evento usando tus funciones del Service
      if (id) {
        setStepMsg("Actualizando...");
        // Si más adelante querés usar tu updateEvento(id, form) del service acá, lo podés cambiar.
        // Por ahora, para asegurar, se inyecta la lógica centralizada del Service
        const response = await createEvento(form); 
        yaPagado = response?.pagado || false;
      } else {
        setStepMsg("Creando...");
        const response = await createEvento(form);
        eventoId = response?.id || response?.data?.id || response?.evento?.id;

        if (!eventoId) {
          throw new Error("No se pudo obtener el ID del evento creado");
        }
        yaPagado = false;
      }

      // 2. Subida de Portada
      if (eventoId && imagenPortada) {
        setStepMsg("Subiendo portada...");
        await uploadPortada(eventoId, imagenPortada);
      }

      // 3. Subida de Galería de Fotos usando tu función del Service (Protegida)
      if (eventoId && galeria.length > 0) {
        setStepMsg("Subiendo galería...");
        for (let img of galeria) {
          await uploadGaleria(eventoId, img);
        }
      }

      // 4. Subida del Fondo Musical usando tu función del Service (Protegida)
      if (eventoId && cancion) {
        setStepMsg("Subiendo fondo musical...");
        await uploadMusica(eventoId, cancion);
      }

      // 5. Sincronización del Itinerario usando tu función del Service (Protegida)
      if (eventoId) {
        setStepMsg("Sincronizando cronograma...");
        await syncCronograma(eventoId, cronograma);

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
        if (typeof backendData === "object" && !backendData.error && !backendData.message) {
          setErrors(backendData); 
        } else {
          setErrors({ global: backendData.error || backendData.message || "Error al validar los datos." });
        }
      } else {
         setErrors({ global: error.response?.data?.error || "Error de conexión con el servidor. Inténtalo de nuevo." });
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName) => `w-full p-3.5 bg-gray-50/50 border rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 text-gray-800 transition-all placeholder:text-gray-400 text-sm md:text-base ${
    errors[fieldName] ? "border-red-400 bg-red-50/30 focus:ring-red-400" : "border-gray-200"
  }`;

  const ErrorLabel = ({ field }) => errors[field] ? (
    <p className="text-xs text-red-500 font-semibold mt-1.5 ml-1 animate-in fade-in slide-in-from-top-1 duration-150">
      ⚠️ {errors[field]}
    </p>
  ) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 px-3 md:px-0">
      <div className="max-w-3xl mx-auto pt-4 md:pt-6">
        
        {/* Encabezado adaptable */}
        <div className="flex items-center gap-3 mb-6 md:mb-8">
          <button onClick={() => navigate(-1)} className="p-2.5 md:p-3 bg-white rounded-xl md:rounded-2xl shadow-sm hover:shadow-md transition-all">
            <ArrowLeft size={18} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
              {id ? "Refinar Invitación" : "Crear Experiencia"}
            </h1>
            <p className="text-xs text-gray-500 hidden md:block">Completá los campos para diseñar la tarjeta interactiva.</p>
          </div>
        </div>

        {errors.global && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl text-sm font-medium">
            💥 {errors.global}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
          
          {/* SECCIÓN 1: DATOS GENERALES */}
          <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg"><Type className="text-indigo-600" size={18} /></div>
              <h2 className="text-lg md:text-xl font-bold text-gray-800">1. Datos de la Fiesta</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">¿Quién o qué se festeja?</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="ej: Mis 15 Años - Sofía / Casamiento Lu y Rodri" className={inputClass("nombre")} />
                <ErrorLabel field="nombre" />
              </div>
              
              {/* Grid colapsable en móvil */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Fecha y Hora del Evento</label>
                  <div className="relative flex items-center">
                    <Calendar className="absolute left-4 text-gray-400 pointer-events-none hidden md:block" size={18} />
                    <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} className={`${inputClass("fecha")} md:pl-11`} />
                  </div>
                  <ErrorLabel field="fecha" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Nombre del Salón / Quinta</label>
                  <div className="relative flex items-center">
                    <MapPin className="absolute left-4 text-gray-400 pointer-events-none hidden md:block" size={18} />
                    <input name="lugar" value={form.lugar} onChange={handleChange} placeholder="ej: Salón de Eventos Las Acacias" className={`${inputClass("lugar")} md:pl-11`} />
                  </div>
                  <ErrorLabel field="lugar" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Dirección Exacta (Para el GPS/Google Maps)</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="ej: Av. Casey 1234, Coronel Suárez" className={inputClass("direccion")} />
                <ErrorLabel field="direccion" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 ml-1">Texto de Bienvenida / Dedicatoria</label>
                <textarea name="mensaje_principal" value={form.mensaje_principal} onChange={handleChange} placeholder="ej: 'Hay momentos que son inolvidables, y compartirlos con las personas que más queremos los hace eternos. ¡Te espero para celebrar juntos!'" className={`${inputClass("mensaje_principal")} h-28 md:h-32 resize-none`} />
                <ErrorLabel field="mensaje_principal" />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: CRONOGRAMA ADAPTABLE */}
          <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-5 md:mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-50 rounded-lg"><Clock className="text-amber-600" size={18} /></div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800">2. Itinerario / Cronograma</h2>
                  <p className="text-xs text-gray-400 hidden md:block">Contale a tus invitados cómo se va a organizar la jornada.</p>
                </div>
              </div>
              <button type="button" onClick={addCronogramaItem} className="flex items-center gap-1 text-xs md:text-sm font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl transition-colors">
                <Plus size={16} /> Agregar
              </button>
            </div>
            
            <div className="space-y-4">
              {cronograma.map((item, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50/70 rounded-2xl border border-gray-100 items-stretch md:items-start group relative">
                  
                  {/* Fila superior en móvil: Hora y Botón Borrar */}
                  <div className="flex items-center justify-between md:block">
                    <span className="text-xs font-bold text-gray-400 md:hidden block">Paso #{index + 1}</span>
                    <input type="time" value={item.hora} onChange={(e) => handleCronogramaChange(index, "hora", e.target.value)} className="p-2.5 bg-white rounded-xl border border-gray-200 text-sm font-semibold shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none w-28 md:w-auto" />
                    
                    {/* Botón borrar visible siempre en móvil */}
                    <button type="button" onClick={() => setCronograma(cronograma.filter((_, i) => i !== index))} className="md:absolute md:top-4 md:right-4 p-2.5 bg-red-50 text-red-500 md:text-red-400 rounded-xl md:opacity-0 md:group-hover:opacity-100 hover:text-red-600 hover:bg-red-100 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  {/* Inputs apilados en móvil */}
                  <div className="flex-1 space-y-2">
                    <input placeholder="¿Qué pasa a esta hora? (ej: Recepción de invitados / Vals)" value={item.titulo} onChange={(e) => handleCronogramaChange(index, "titulo", e.target.value)} className="w-full bg-white md:bg-transparent p-2.5 md:p-0 rounded-xl md:rounded-none border border-gray-100 md:border-none font-bold text-gray-800 text-sm outline-none placeholder:text-gray-400 focus:bg-white md:focus:bg-transparent" />
                    <input placeholder="Detalle opcional (ej: Barra libre de licuados / Entrada al salón)" value={item.descripcion} onChange={(e) => handleCronogramaChange(index, "descripcion", e.target.value)} className="w-full bg-white md:bg-transparent p-2.5 md:p-0 rounded-xl md:rounded-none border border-gray-100 md:border-none text-xs md:text-sm text-gray-500 outline-none placeholder:text-gray-400 focus:bg-white md:focus:bg-transparent" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECCIÓN 3: MULTIMEDIA */}
          <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-[2rem] shadow-sm border border-gray-100 space-y-6 md:space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-5 md:mb-6">
                <div className="p-2 bg-emerald-50 rounded-lg"><ImageIcon className="text-emerald-600" size={18} /></div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800">3. Fotos de la Tarjeta</h2>
              </div>
              
              {/* Portada */}
              <div className="mb-6">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Foto Principal (Banner de arriba)</p>
                <div className={`relative overflow-hidden rounded-2xl md:rounded-3xl border-2 border-dashed transition-colors ${
                  errors.portada ? "border-red-300 bg-red-50/10" : "border-gray-200 hover:border-indigo-400"
                }`}>
                  {previewPortada ? (
                    <div className="relative h-44 md:h-56">
                      <img src={previewPortada} className="w-full h-full object-cover" alt="Preview" />
                      <button type="button" onClick={() => {setImagenPortada(null); setPreviewPortada(null);}} className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur rounded-full shadow-xl text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-36 md:h-40 cursor-pointer p-4 text-center">
                      <UploadCloud size={28} className="text-indigo-500 mb-1" />
                      <span className="text-sm font-bold text-gray-700">Subir foto de portada</span>
                      <span className="text-xs text-gray-400 mt-0.5">Es la imagen que abre la invitación</span>
                      <input type="file" accept="image/*" className="hidden" onChange={handlePortadaChange} />
                    </label>
                  )}
                </div>
                <ErrorLabel field="portada" />
              </div>

              {/* Galería */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Álbum de Fotos (Opcional, Máx 3)</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galeriaExistente.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={`${API_URL.replace('/api', '')}${img.url}`} className="w-full h-full object-cover opacity-80" alt="Old" />
                    </div>
                  ))}
                  {galeria.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border-2 border-indigo-500 relative">
                      <img src={URL.createObjectURL(img)} className="w-full h-full object-cover" alt="New" />
                      <button type="button" onClick={() => removeImagenNueva(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full"><Trash2 size={10}/></button>
                    </div>
                  ))}
                  {(galeria.length + galeriaExistente.length) < 3 && (
                    <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-all p-2 text-center">
                      <Plus className="text-gray-400 mb-1" size={20} />
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Agregar</span>
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleGaleriaChange} />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Fondo Musical */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-violet-50 rounded-lg"><Music className="text-violet-600" size={18} /></div>
                <h3 className="text-lg font-bold text-gray-800">4. Música de Fondo</h3>
              </div>
              
              <div className={`p-4 rounded-xl md:rounded-2xl border-2 border-dashed transition-all ${
                previewCancion ? "border-violet-200 bg-violet-50/10" : "border-gray-200 hover:border-violet-400"
              }`}>
                {previewCancion ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <Music className="text-violet-500 flex-shrink-0" size={16} />
                        <span className="text-xs md:text-sm font-semibold text-gray-700 truncate">
                          {cancion ? cancion.name : "Música activa en la tarjeta"}
                        </span>
                      </div>
                      <button type="button" onClick={() => { setCancion(null); setPreviewCancion(null); }} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <audio src={previewCancion} controls className="w-full h-10 rounded-lg" />
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center py-4 cursor-pointer text-center">
                    <UploadCloud size={24} className="text-violet-500 mb-1" />
                    <span className="text-sm font-bold text-gray-600">Elegir un archivo de audio (.mp3)</span>
                    <span className="text-[11px] text-gray-400">Sonará cuando los invitados abran el link</span>
                    <input type="file" accept="audio/*" className="hidden" onChange={handleCancionChange} />
                  </label>
                )}
              </div>
              <ErrorLabel field="cancion" />
            </div>
          </div>

          {/* BOTÓN DE ACCIÓN FIJO O ADAPTABLE */}
          <div className="pt-2">
            <button disabled={loading} className="w-full py-4 md:py-5 bg-black text-white rounded-xl md:rounded-2xl font-bold text-base md:text-lg shadow-xl hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>{stepMsg}</span>
                </>
              ) : (
                id ? "Guardar cambios" : "Crear Invitación"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditorDetalle;