import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { createEvento } from "../../services/EventService"

function CrearEvento() {

  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const template = searchParams.get("template") || "classic"

  const [form, setForm] = useState({
    nombre: "",
    fecha: "",
    lugar: "",
    direccion: "",
    mensaje_principal: ""
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)

    try {

      const data = await createEvento({
        ...form,
        template
      })

      const eventoId = data.evento.id

      navigate(`/dashboard/evento/${eventoId}`)

    } catch (error) {
      console.error("Error creando evento", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow w-full max-w-xl"
      >

        <h2 className="text-2xl font-bold mb-6">
          Crear invitación
        </h2>

        <div className="mb-4">
          <label className="block mb-1">Nombre del evento</label>
          <input
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Fecha</label>
          <input
            type="datetime-local"
            name="fecha"
            value={form.fecha}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Lugar</label>
          <input
            type="text"
            name="lugar"
            value={form.lugar}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1">Dirección</label>
          <input
            type="text"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1">Mensaje principal</label>
          <textarea
            name="mensaje_principal"
            value={form.mensaje_principal}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-2 rounded"
        >
          {loading ? "Creando..." : "Crear invitación"}
        </button>

      </form>

    </div>
  )
}

export default CrearEvento