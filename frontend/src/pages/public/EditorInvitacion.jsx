import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Save, ChevronLeft, Sparkles, ArrowLeft, Type, ImageIcon } from 'lucide-react';

import HeroSection from "../../components/public/hero/HeroSection";
import AuthModal from "./AuthModal";

const EditorInvitacion = () => {

  const navigate = useNavigate();
  const location = useLocation();

  // 📌 TEMPLATE DESDE URL (?template=modern)
  const queryParams = new URLSearchParams(location.search);
  const templateFromURL = queryParams.get("template") || "modern";

  const [formData, setFormData] = useState({
    nombre: "MI GRAN EVENTO",
    mensaje_principal: "TE INVITAMOS A CELEBRAR CON NOSOTROS ESTE MOMENTO TAN ESPECIAL.",
    imagen: null,
    template: templateFromURL,
  });

  const [pasoActual, setPasoActual] = useState(1);
  const [showLoginModal, setShowLoginModal] = useState(false); // Sigue controlando la apertura del modal

  // 🔙 Volver
  const handleBackToPanel = () => {
    navigate("/");
  };

  // ✏️ Inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🖼️ Imagen (SOLO preview - NO base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // liberar anterior
      if (formData.imagen) {
        URL.revokeObjectURL(formData.imagen);
      }

      const imageUrl = URL.createObjectURL(file);

      setFormData(prev => ({
        ...prev,
        imagen: imageUrl
      }));
    }
  };

  // 💾 Guardar + flujo login
  const handlePublish = () => {
    const token = localStorage.getItem("token");

    // 📦 draft LIVIANO (SIN imagen)
    const draft = {
      nombre: formData.nombre,
      mensaje_principal: formData.mensaje_principal,
      template: formData.template
    };

    localStorage.setItem("draftEvento", JSON.stringify(draft));

    // Si no hay token, disparamos el modal real en vez de navegar
    if (!token || token === "undefined" || token === "null") {
      setShowLoginModal(true);
      return;
    }

    // Si ya está logueado, pasa directo al dashboard de detalles
    navigate("/editor-detalle");
  };

  // 🔥 Se ejecuta cuando el usuario se loguea con éxito desde el modal
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate("/editor-detalle"); // Lo mandamos directo a continuar su flujo
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white font-sans overflow-hidden">

      {/* PANEL IZQUIERDO */}
      <aside className="w-full lg:w-[450px] p-8 border-r border-gray-100 flex flex-col h-screen overflow-y-auto bg-white z-20 shadow-xl">

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
              {/* TÍTULO */}
              <div>
                <label className="text-xs font-bold uppercase flex items-center gap-2">
                  <Type size={12}/> Título
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 rounded-xl"
                />
              </div>

              {/* MENSAJE */}
              <div>
                <label className="text-xs font-bold uppercase">
                  Mensaje
                </label>
                <textarea
                  name="mensaje_principal"
                  value={formData.mensaje_principal}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-50 rounded-xl"
                />
              </div>

              {/* IMAGEN */}
              <div>
                <label className="text-xs font-bold uppercase flex items-center gap-2">
                  <ImageIcon size={12}/> Imagen
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {formData.imagen && (
                  <img
                    src={formData.imagen}
                    alt="preview"
                    className="w-full h-32 object-cover rounded-xl mt-2"
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
                  className={`w-full p-3 rounded-xl ${
                    formData.template === t ? "bg-indigo-100" : "bg-gray-100"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* BOTONES */}
        <div className="mt-6 flex gap-2">

          {pasoActual === 2 && (
            <button
              onClick={() => setPasoActual(1)}
              className="p-3 bg-gray-100 rounded-xl"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <button
            onClick={handlePublish}
            className="flex-1 py-3 bg-black text-white rounded-xl font-bold text-xs uppercase"
          >
            Guardar
          </button>

        </div>

      </aside>

      {/* PREVIEW */}
      <main className="flex-1 relative h-screen overflow-hidden">
        <HeroSection
          titulo={formData.nombre}
          mensaje={formData.mensaje_principal}
          imagen={formData.imagen}
          variant={formData.template}
        />
      </main>

      {/* 🔐 MODAL LOGIN REAL CON PASO DE SUCESO */}
      <AuthModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess} // 👈 2. Le pasamos el callback al modal
      />

    </div>
  );
};

export default EditorInvitacion;
          