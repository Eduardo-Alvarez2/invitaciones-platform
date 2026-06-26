import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  loginUsuario, 
  registrarUsuario, 
  verificarCuenta, 
  reenviarCodigoAuth 
} from "../../services/EventService";

import { 
  Mail, Lock, Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, X, User, KeyRound 
} from "lucide-react";

function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const navigate = useNavigate();
  
  const [vista, setVista] = useState("login"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  
  const [emailParaVerificar, setEmailParaVerificar] = useState("");
  const [codigoVerificacion, setCodigoVerificacion] = useState("");

  const [form, setForm] = useState({ nombre: "", email: "", password: "", confirmPassword: "" });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    if (vista === "register" && form.confirmPassword !== "") {
      setPasswordsMatch(form.password === form.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [form.password, form.confirmPassword, vista]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Limpiador para cuando el usuario cierra manualmente el modal
  const handleCloseModal = () => {
    setError("");
    setSuccessMsg("");
    setForm({ nombre: "", email: "", password: "", confirmPassword: "" });
    onClose();
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      const data = await reenviarCodigoAuth(emailParaVerificar);
      setSuccessMsg(data.mensaje || "¡Código reenviado con éxito!");
    } catch (err) {
      setError(err.response?.data?.error || "Error al intentar reenviar el código.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    if (codigoVerificacion.length !== 6) {
      setError("El código debe tener exactamente 6 dígitos");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      await verificarCuenta(emailParaVerificar, codigoVerificacion);
      setSuccessMsg("¡Cuenta activada con éxito! Ya puedes iniciar sesión.");
      setCodigoVerificacion("");
      setVista("login"); 
    } catch (err) {
      setError(err.response?.data?.error || "El código es incorrecto o expiró.");
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Manejador principal para Login y Registro (Corregido)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (vista === "register" && !passwordsMatch) {
      setError("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    setError("");
    setSuccessMsg("");
    
    try {
      if (vista === "register") {
        await registrarUsuario(form.nombre, form.email, form.password);
        setEmailParaVerificar(form.email);
        setSuccessMsg("¡Registro casi listo! Te enviamos un código de 6 dígitos a tu mail.");
        setVista("verify"); 
      } else {
        const data = await loginUsuario(form.email, form.password);
        
        // 🛡️ Doble chequeo: Nos aseguramos de que el backend realmente devolvió los tokens
        if (data && data.access_token) {
          localStorage.setItem("token", data.access_token);
          localStorage.setItem("refresh_token", data.refresh_token);

          if (onLoginSuccess) {
            onLoginSuccess();
          } else {
            onClose();
            window.location.reload();
          }
        } else {
          throw new Error("Respuesta inválida del servidor");
        }
      }
    } catch (err) {
      // 🚨 ¡LA CLAVE DE LA SOLUCIÓN! 🚨
      // Si el login falla por cualquier motivo, limpiamos inmediatamente el localStorage
      // para evitar que queden cadenas como "undefined" o "null" simulando una sesión activa.
      if (vista === "login") {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
      }

      if (err.response?.status === 403) {
        setEmailParaVerificar(form.email); 
        setError(err.response.data.error); 
        
        setTimeout(() => {
          setVista("verify");
          setSuccessMsg("Ingresa el código para activar tu cuenta. Si no te llegó, usa el botón de abajo.");
          setError("");
        }, 2000);
        
      } else {
        setError(err.response?.data?.error || "Credenciales incorrectas o error de conexión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleCloseModal}></div>
      
      {/* Modal */}
      <div className="relative bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-300">
        <button onClick={handleCloseModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600">
          <X size={20} />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          {vista === "login" && "Bienvenido"}
          {vista === "register" && "Crear cuenta"}
          {vista === "verify" && "Verifica tu cuenta"}
        </h2>
        
        {vista === "verify" && (
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            Ingresá los 6 números que enviamos a tu casilla <strong>{emailParaVerificar}</strong> para activar el alta.
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 text-xs border border-red-100">
            <AlertCircle size={16} /> <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 text-xs border border-emerald-100">
            <CheckCircle2 size={16} /> <span>{successMsg}</span>
          </div>
        )}

        {vista !== "verify" ? (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {vista === "register" && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nombre</label>
                <div className="relative mt-1">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all" placeholder="Tu nombre" />
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all" placeholder="ejemplo@correo.com" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contraseña</label>
              <div className="relative mt-1">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input type={showPass ? "text" : "password"} name="password" value={form.password} onChange={handleChange} required className="w-full pl-12 pr-12 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:border-indigo-500 transition-all" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {vista === "register" && (
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Confirmar Contraseña</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showConfirmPass ? "text" : "password"} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required className={`w-full pl-12 pr-12 py-3 bg-slate-50 border rounded-2xl text-sm outline-none transition-all ${!passwordsMatch ? 'border-red-300' : 'border-slate-100 focus:border-indigo-500'}`} placeholder="Repetir contraseña" />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showConfirmPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all flex items-center justify-center shadow-lg shadow-indigo-200">
              {loading ? <Loader2 className="animate-spin" size={18} /> : (vista === "register" ? "Registrarse" : "Ingresar")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifySubmit} className="space-y-5 mt-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Código de activación</label>
              <div className="relative mt-1">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  maxLength="6" 
                  value={codigoVerificacion} 
                  onChange={(e) => setCodigoVerificacion(e.target.value.replace(/\D/g, ""))} 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-mono font-bold tracking-[0.4em] text-center outline-none focus:border-indigo-500 transition-all" 
                  placeholder="123456" 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-emerald-700 transition-all flex items-center justify-center shadow-lg shadow-emerald-100">
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Activar Cuenta"}
            </button>

            <div className="text-center mt-3">
              <button
                type="button"
                disabled={loading}
                onClick={handleResendCode}
                className="text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-all disabled:opacity-50"
              >
                ¿No te llegó? Reenviar código
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          {vista === "verify" ? (
            <button onClick={() => { setVista("login"); setError(""); setSuccessMsg(""); }} className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">
              Volver al Login
            </button>
          ) : (
            <button onClick={() => { setVista(vista === "login" ? "register" : "login"); setError(""); setSuccessMsg(""); }} className="text-xs font-bold text-indigo-600 uppercase tracking-widest hover:underline">
              {vista === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Ingresa"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;