import { useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"

function Login() {

  const navigate = useNavigate()
  const location = useLocation()

  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const redirect = new URLSearchParams(location.search).get("redirect")

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {

      if (isRegister) {
        // REGISTRO
        await axios.post("http://localhost:5000/auth/register", form)

        // después de registrarse → lo mandamos a login automáticamente
        setIsRegister(false)
        setError("Usuario creado correctamente. Ahora iniciá sesión.")

      } else {
        // LOGIN
        const res = await axios.post("http://localhost:5000/auth/login", form)

        const token = res.data.access_token

        localStorage.setItem("token", token)

        // redirect inteligente
        navigate(redirect || "/")
      }

    } catch (err) {
      console.error(err)
      setError("Credenciales inválidas o error en el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">

        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Crear cuenta" : "Iniciar sesión"}
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1">Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2 rounded"
          >
            {loading
              ? "Procesando..."
              : isRegister
                ? "Crear cuenta"
                : "Ingresar"}
          </button>

        </form>

        {/* TOGGLE */}
        <div className="text-center mt-6">
          {isRegister ? (
            <p>
              ¿Ya tenés cuenta?{" "}
              <button
                onClick={() => setIsRegister(false)}
                className="text-blue-600 underline"
              >
                Iniciar sesión
              </button>
            </p>
          ) : (
            <p>
              ¿No tenés cuenta?{" "}
              <button
                onClick={() => setIsRegister(true)}
                className="text-blue-600 underline"
              >
                Crear una
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  )
}

export default Login