import { Outlet, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LogOut } from "lucide-react";
import Logo from "../../components/Logo";

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("draftEvento");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans antialiased">
      
      {/* 🔝 NAVBAR PREMIUM DEL PANEL */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo clickeable que te lleva al Dashboard */}
          <Link to="/dashboard" className="hover:opacity-90 transition-opacity">
            <Logo light={true} /> {/* 👈 Usamos light={true} para fondo claro */}
          </Link>

          {/* Acciones de Navegación */}
          <div className="flex items-center gap-6">
            
            {/* Botón Volver al Home de la Web */}
            <Link 
              to="/" 
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={14} /> Volver al Home
            </Link>

            {/* Separador visual */}
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>

            {/* Botón Salir / Cerrar Sesión */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={14} /> Salir
            </button>

          </div>
        </div>
      </header>

      {/* 🎰 CONTENIDO DINÁMICO (Dashboard General, etc.) */}
      <main className="py-6">
        <Outlet />
      </main>

    </div>
  );
}

export default MainLayout;