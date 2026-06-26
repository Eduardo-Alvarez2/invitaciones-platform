import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, Sparkles, ArrowLeft, Type, ImageIcon, Eye, Edit2 } from 'lucide-react';

import HeroSection from "../../components/public/hero/HeroSection";
import AuthModal from "./AuthModal";

const EditorInvitacion = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const templateFromURL = queryParams.get("template") || "modern";

  const [formData, setFormData] = useState({
    nombre: "MI GRAN EVENTO",
    mensaje_principal: "TE INVITAMOS A CELEBRAR CON NOSOTROS ESTE MOMENTO TAN ESPECIAL.",
    imagen: null,
    template: templateFromURL,
  });

  const [pasoActual, setPasoActual] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // 📱 Estado para controlar la pestaña activa EN MÓVILES ('edit' o 'preview')
  const [activeTab, setActiveTab] = useState('edit');

  const handleBackToPanel = () => {
    navigate("/");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (formData.imagen) {
        URL.revokeObjectURL(formData.imagen);
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, imagen: imageUrl }));
    }
  };

  const handlePublish = () => {
    const token = localStorage.getItem("token");
    const draft = {
      nombre: formData.nombre,
      mensaje_principal: formData.mensaje_principal,
      template: formData.template
    };

    localStorage.setItem("draftEvento", JSON.stringify(draft));

    if (!token || token === "undefined" || token === "null") {
      setShowLoginModal(true);
      return;
    }

    navigate("/editor-detalle");
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate("/editor-detalle");
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans overflow-hidden relative">
      
      {/* BARRA DE PESTAÑAS (SOLO VISIBLE EN CELULARES) */}
      <div className="lg:hidden fixed top-0 left-0 w-full bg-white border-b border-gray-100 z-40 flex h-14 shadow-sm">
        <button
          onClick={() => setActiveTab('edit')}
          className={`flex-1 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === 'edit' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-400'
          }`}
        >
          <Edit2 size={14} /> Editar
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex-1 flex items-center justify-center gap-2 font-black text-[10px] uppercase tracking-widest transition-all ${
            activeTab === 'preview' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-gray-400'
          }`}
        >
          <Eye size={14} /> Vista Previa
        </button>
      </div>

      {/* PANEL IZQUIERDO (CAMPOS) */}
      <aside className={`w-full lg:w-[450px] p-8 border-r border-gray-100 flex flex-col h-screen overflow-y-auto bg-white z-20 shadow-xl pt-20 lg:pt-8 ${
        activeTab === 'edit' ? 'flex' : 'hidden lg:flex'
      }`}>

        <button 
          onClick={handleBackToPanel}
          className="flex items-center gap-2 text-gray-400 mb-6 text-[10px] font-black uppercase tracking-widest hover:text-black"
        >
          <ArrowLeft size={14} /> Volver
        </button>

        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="text-indigo-600" size={20} />
            <h1 className="text-xl font-black uppercase">Editor</h1>
          </div>
          <p className="text-[10px] text-gray-400 uppercase">
            Template: <span className="text-indigo-600">{formData.template}</span>
          </p>
        </div>

        <div className="flex-1 space-y-6">
          {pasoActual === 1 ? (
            <>
              <div>
                <label className="text-xs font-bold uppercase flex items-center gap-2 mb-2 text-gray-700">
                  <Type size={12}/> Título de la tarjeta
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase mb-2 block text-gray-700">
                  Mensaje Principal
                </label>
                <textarea
                  name="mensaje_principal"
                  value={formData.mensaje_principal}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase flex items-center gap-2 mb-2 text-gray-700">
                  <ImageIcon size={12}/> Imagen de fondo / Portada
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:uppercase file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                />
                {formData.imagen && (
                  <img
                    src={formData.imagen}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-xl mt-3 border border-gray-100"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="space-y-3">
              {['modern', 'classic', 'minimal'].map(t => (
                <button
                  key={t}
                  onClick={() => setFormData(p => ({ ...p, template: t }))}
                  className={`w-full p-4 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${
                    formData.template === t ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-2">
          {pasoActual === 2 && (
            <button
              onClick={() => setPasoActual(1)}
              className="p-3.5 bg-gray-100 rounded-xl text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <button
            onClick={handlePublish}
            className="flex-1 py-3.5 bg-black text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-colors shadow-xl shadow-black/10"
          >
            Continuar y Crear
          </button>
        </div>
      </aside>

      {/* PREVIEW (HERO) */}
      <main className={`flex-1 relative h-screen overflow-hidden pt-14 lg:pt-0 ${
        activeTab === 'preview' ? 'block' : 'hidden lg:block'
      }`}>
        <HeroSection
          titulo={formData.nombre}
          mensaje={formData.mensaje_principal}
          imagen={formData.imagen}
          variant={formData.template}
        />
      </main>

      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
};

export default EditorInvitacion;
          