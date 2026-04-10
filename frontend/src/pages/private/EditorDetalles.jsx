import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createEvento,
  uploadPortada
} from "../../services/EventService";
import axios from "axios";
import { 
  ArrowLeft, Loader2, Plus, Trash2, 
  UploadCloud, Calendar, MapPin, Type, Image as ImageIcon, Clock 
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function EditorDetalle() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [stepMsg, setStepMsg] = useState("");

  const [imagenPortada, setImagenPortada] = useState(null);
  const [galeria, setGaleria] = useState([]);
  const [cronograma, setCronograma] = useState([
    { hora: "", titulo: "", descripcion: "" }
  ]);

  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    direccion: "",
    mensaje_principal: "",
    template: "modern"
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login?redirect=/editor-detalle");
      return;
    }

    const draft = JSON.parse(localStorage.getItem("draftEvento"));
    if (draft) {
      setForm(prev => ({
        ...prev,
        nombre: draft.nombre || "",
        mensaje_principal: draft.mensaje_principal || "",
        template: draft.template || "modern"
      }));
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePortadaChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagenPortada(file);
  };

  const handleGaleriaChange = (e) => {
    const files = Array.from(e.target.files);
    setGaleria(prev => [...prev, ...files].slice(0, 3));
  };

  const removeImagen = (index) => {
    setGaleria(prev => prev.filter((_, i) => i !== index));
  };

  const addCrono = () => {
    setCronograma(prev => [...prev, { hora: "", titulo: "", descripcion: "" }]);
  };

  const removeCrono = (index) => {
    setCronograma(prev => prev.filter((_, i) => i !== index));
  };

  const handleCronoChange = (index, field, value) => {
    const updated = [...cronograma];
    updated[index] = { ...updated[index], [field]: value };
    setCronograma(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.fecha || !form.lugar || !form.direccion) {
      alert("Completá todos los campos obligatorios");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // 1️⃣ CREAR EVENTO 
      setStepMsg("Creando evento...");
      const data = await createEvento(form);
      const eventoId = data.evento?.id || data.id; 

      // 2️⃣ PORTADA 
      if (imagenPortada) {
        setStepMsg("Subiendo portada...");
        await uploadPortada(eventoId, imagenPortada);
      }

      // 3️⃣ GALERIA
      for (let img of galeria) {
        setStepMsg("Subiendo galería...");
        const fd = new FormData();
        fd.append("file", img);
        await axios.post(`${API_URL}/eventos/${eventoId}/imagenes`, fd, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      // 4️⃣ CRONOGRAMA
      for (let item of cronograma) {
        if (!item.hora || !item.titulo) continue;
        setStepMsg("Guardando cronograma...");
        await axios.post(`${API_URL}/eventos/${eventoId}/cronograma`, item, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      localStorage.removeItem("draftEvento");
      navigate(`/dashboard/evento/${eventoId}`);

    } catch (error) {
      console.error("ERROR BACK:", error.response?.data || error);
      alert("Error al crear la invitación. Revisa la consola.");
    } finally {
      setLoading(false);
      setStepMsg("");
    }
  };

  // Clases CSS reutilizables para los inputs
  const inputClass = "w-full p-3.5 bg-gray-50/50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-gray-700 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 p-6 max-w-3xl mx-auto w-full">
        <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors text-gray-600">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Detalles de tu Invitación</h1>
          <p className="text-sm text-gray-500">Personaliza la experiencia para tus invitados</p>
        </div>
      </div>

      <div className="flex justify-center px-4 pb-12 w-full">
        <form onSubmit={handleSubmit} className="w-full max-w-3xl space-y-8">
          
          {/* SECCIÓN 1: DATOS BÁSICOS */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Type className="text-indigo-500" size={24} />
              <h2 className="text-lg font-bold text-gray-800">Información Principal</h2>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre del Evento *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Boda de Ana y Juan" className={inputClass} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    <Calendar size={16} className="text-gray-400"/> Fecha y Hora *
                  </label>
                  <input type="datetime-local" name="fecha" value={form.fecha} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 ">
                    <MapPin size={16} className="text-gray-400"/> Lugar (Salón) *
                  </label>
                  <input name="lugar" value={form.lugar} onChange={handleChange} placeholder="Ej: Estancia Las Rosas" className={inputClass} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Dirección Exacta *</label>
                <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle Falsa 123, Ciudad" className={inputClass} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mensaje de Bienvenida</label>
                <textarea name="mensaje_principal" value={form.mensaje_principal} onChange={handleChange} placeholder="¡Nos encantaría que nos acompañes en este día tan especial!" className={`${inputClass} resize-none h-28`} />
              </div>
            </div>
          </div>

          {/* SECCIÓN 2: IMÁGENES */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <ImageIcon className="text-indigo-500" size={24} />
              <h2 className="text-lg font-bold text-gray-800">Diseño y Fotos</h2>
            </div>

            <div className="space-y-6">
              {/* Portada */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Imagen de Portada</label>
                {!imagenPortada ? (
                  <label htmlFor="portada-upload" className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-indigo-200 bg-indigo-50/30 rounded-2xl cursor-pointer hover:bg-indigo-50 transition-colors">
                    <UploadCloud className="w-8 h-8 text-indigo-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Haz clic para subir tu portada</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG hasta 5MB</p>
                    <input id="portada-upload" type="file" accept="image/*" onChange={handlePortadaChange} className="hidden" />
                  </label>
                ) : (
                  <div className="relative group">
                    <img src={URL.createObjectURL(imagenPortada)} className="h-48 w-full rounded-2xl object-cover shadow-sm" alt="Portada" />
                    <button type="button" onClick={() => setImagenPortada(null)} className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Galería */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Galería de Fotos</label>
                  <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-md">{galeria.length} / 3 permitidas</span>
                </div>
                
                {galeria.length < 3 && (
                  <label htmlFor="galeria-upload" className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors mb-4">
                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                      <Plus size={16}/> Agregar fotos a la galería
                    </p>
                    <input id="galeria-upload" type="file" multiple accept="image/*" onChange={handleGaleriaChange} className="hidden" />
                  </label>
                )}

                {galeria.length > 0 && (
                  <div className="grid grid-cols-3 gap-4">
                    {galeria.map((img, i) => (
                      <div key={i} className="relative group aspect-square">
                        <img src={URL.createObjectURL(img)} className="w-full h-full object-cover rounded-2xl shadow-sm border border-gray-100" alt={`Galeria ${i}`} />
                        <button type="button" onClick={() => removeImagen(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md transform scale-0 group-hover:scale-100 transition-transform">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* SECCIÓN 3: CRONOGRAMA */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="text-indigo-500" size={24} />
                <h2 className="text-lg font-bold text-gray-800">Cronograma</h2>
              </div>
              <button type="button" onClick={addCrono} className="flex items-center gap-1.5 text-sm bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-indigo-100 transition-colors">
                <Plus size={16} /> Añadir
              </button>
            </div>

            <div className="space-y-4">
              {cronograma.map((item, i) => (
                <div key={i} className="flex flex-col md:flex-row gap-3 p-4 bg-gray-50/50 border border-gray-200 rounded-2xl relative group">
                  <input type="time" value={item.hora} onChange={(e) => handleCronoChange(i, "hora", e.target.value)} className="p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500 w-full md:w-32" />
                  <div className="flex-1 space-y-3">
                    <input placeholder="Título (ej: Recepción)" value={item.titulo} onChange={(e) => handleCronoChange(i, "titulo", e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm font-medium focus:ring-2 focus:ring-indigo-500" />
                    <input placeholder="Descripción breve (opcional)" value={item.descripcion} onChange={(e) => handleCronoChange(i, "descripcion", e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  
                  {cronograma.length > 1 && (
                    <button type="button" onClick={() => removeCrono(i)} className="absolute -top-2 -right-2 md:top-auto md:bottom-4 md:right-4 bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 p-2 rounded-full shadow-sm transition-all">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* BOTÓN FINAL */}
          <div className="pt-4">
            <button disabled={loading} className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-indigo-200 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-3">
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> 
                  <span className="animate-pulse">{stepMsg || "Procesando..."}</span>
                </>
              ) : (
                "Generar Invitación Premium"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditorDetalle;