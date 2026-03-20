import { useState } from "react"

function RSVPSection({ slug }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    cantidad: 1,
    asiste: true,
    mensaje: ""
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm({
      ...form,
      [name]: type === "number" ? Number(value) : value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/eventos/${slug}/confirmar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Error al confirmar")
      }

      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <section className="py-24 text-center">
        <h2 className="text-2xl font-light">
          ¡Gracias por tu respuesta!
        </h2>
      </section>
    )
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-md mx-auto px-6 text-center">

        <h2 className="text-3xl font-light mb-10 tracking-wide">
          Confirmar Asistencia
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">

          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            required
            onChange={handleChange}
            className="w-full border border-neutral-300 px-4 py-3 rounded-md focus:outline-none focus:border-neutral-800"
          />

          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            required
            onChange={handleChange}
            className="w-full border border-neutral-300 px-4 py-3 rounded-md focus:outline-none focus:border-neutral-800"
          />

          <div className="flex gap-6 justify-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="asiste"
                value="true"
                defaultChecked
                onChange={() => setForm({ ...form, asiste: true })}
              />
              Asisto
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="asiste"
                value="false"
                onChange={() => setForm({ ...form, asiste: false })}
              />
              No asisto
            </label>
          </div>

          {form.asiste && (
            <input
              type="number"
              name="cantidad"
              min="1"
              placeholder="Cantidad de personas"
              onChange={handleChange}
              className="w-full border border-neutral-300 px-4 py-3 rounded-md focus:outline-none focus:border-neutral-800"
            />
          )}

          <textarea
            name="mensaje"
            placeholder="Mensaje (opcional)"
            onChange={handleChange}
            className="w-full border border-neutral-300 px-4 py-3 rounded-md focus:outline-none focus:border-neutral-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-md transition hover:opacity-80"
          >
            {loading ? "Enviando..." : "Confirmar"}
          </button>

        </form>

      </div>
    </section>
  )
}

export default RSVPSection