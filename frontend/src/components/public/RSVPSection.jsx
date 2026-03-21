import React, { useState } from "react";

function RSVPSection({ slug }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    cantidad: 1,
    asiste: true,
    mensaje: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/eventos/${slug}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al confirmar");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section className="py-32 text-center bg-white px-6">
        <div className="max-w-md mx-auto space-y-6 animate-fade-in">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-4xl font-black tracking-tighter text-gray-900 uppercase">¡Confirmado!</h2>
          <p className="text-gray-500 font-light text-lg">Tu respuesta ha sido enviada con éxito. ¡Nos vemos pronto!</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#fafafa] px-6">
      <div className="max-w-xl mx-auto">
        
        {/* Encabezado */}
        <div className="text-center mb-16 space-y-4">
          <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.5em]">Confirmación</span>
          <h2 className="text-5xl font-black tracking-tighter text-gray-900 uppercase">RSVP</h2>
          <p className="text-gray-400 font-light uppercase text-xs tracking-[0.2em]">Por favor, confirma antes de la fecha límite</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-2xl border border-red-100 text-center font-bold uppercase tracking-tighter">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Selector de Asistencia Moderno */}
            <div className="flex p-1 bg-gray-100 rounded-2xl gap-1">
              <button
                type="button"
                onClick={() => setForm({ ...form, asiste: true })}
                className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${form.asiste ? "bg-white text-indigo-600 shadow-md scale-[1.02]" : "text-gray-400 hover:text-gray-600"}`}
              >
                Sí, Asistiré
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, asiste: false })}
                className={`flex-1 py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!form.asiste ? "bg-white text-red-500 shadow-md scale-[1.02]" : "text-gray-400 hover:text-gray-600"}`}
              >
                No podré ir
              </button>
            </div>

            <div className="space-y-4">
              <div className="relative group">
                <input
                  type="text"
                  name="nombre"
                  placeholder="Tu Nombre Completo"
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400"
                />
              </div>

              <div className="relative group">
                <input
                  type="text"
                  name="telefono"
                  placeholder="Tu Teléfono de contacto"
                  required
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400"
                />
              </div>

              {form.asiste && (
                <div className="animate-fade-in">
                  <label className="text-[10px] uppercase font-black text-gray-400 tracking-widest ml-2 mb-2 block">Acompañantes</label>
                  <input
                    type="number"
                    name="cantidad"
                    min="1"
                    value={form.cantidad}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-gray-800 font-medium"
                  />
                </div>
              )}

              <textarea
                name="mensaje"
                placeholder="¿Alguna restricción alimentaria o mensaje especial?"
                onChange={handleChange}
                rows="3"
                className="w-full bg-gray-50 border-none px-6 py-5 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all outline-none text-gray-800 font-medium placeholder:text-gray-400 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-6 rounded-2xl text-white font-black uppercase tracking-[0.3em] text-xs transition-all shadow-lg ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-gray-900 hover:bg-indigo-600 hover:-translate-y-1 active:scale-95 shadow-indigo-200"}`}
            >
              {loading ? "Procesando..." : "Enviar Confirmación"}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default RSVPSection;