import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff
} from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirmPassword: ""
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // 🔥 REDIRECT INTELIGENTE
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (isRegister && form.confirmPassword !== "") {
      setPasswordsMatch(form.password === form.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [form.password, form.confirmPassword, isRegister]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setError("");
    setSuccessMsg("");
    setShowPass(false);
    setShowConfirmPass(false);
    setForm({ nombre: "", email: "", password: "", confirmPassword: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister && !passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (isRegister) {
        // 🔹 REGISTER
        await axios.post("http://localhost:5000/api/register", {
          nombre: form.nombre,
          email: form.email,
          password: form.password
        });

        setIsRegister(false);
        setSuccessMsg("Cuenta creada. Ya puedes ingresar.");
        setForm({
          nombre: "",
          email: form.email,
          password: "",
          confirmPassword: ""
        });

      } else {
        // 🔹 LOGIN
        const res = await axios.post("http://localhost:5000/api/login", {
          email: form.email,
          password: form.password
        });

        // 🔐 Guardar token
        localStorage.setItem("token", res.data.access_token);

        // 🔥 Redirección inteligente
        navigate(redirect);
      }

    } catch (err) {
      setError(err.response?.data?.error || "Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">

        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100">

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800">
              {isRegister ? "Crear cuenta" : "Iniciar Sesión"}
            </h1>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm border border-red-100">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3 text-sm border border-emerald-100">
              <CheckCircle2 size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NOMBRE (solo register) */}
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-500">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-sm"
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="text-xs font-semibold text-slate-500">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 py-3 bg-slate-50 border rounded-xl text-sm"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-semibold text-slate-500">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPass ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border rounded-xl text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            {isRegister && (
              <div>
                <label className="text-xs font-semibold text-slate-500">Confirmar Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full py-3 px-4 bg-slate-50 border rounded-xl text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                {!passwordsMatch && (
                  <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold text-sm flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : (
                <>
                  {isRegister ? "Crear cuenta" : "Ingresar"}
                  {!isRegister && <ArrowRight size={16} />}
                </>
              )}
            </button>

          </form>

          <div className="mt-6 text-center">
            <button onClick={toggleRegister} className="text-sm text-blue-600">
              {isRegister ? "Ya tengo cuenta" : "Crear cuenta"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
