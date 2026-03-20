import { Routes, Route } from "react-router-dom"

import Login from "../pages/public/Login"
import DashboardEvento from "../pages/private/DashboardEvento"
import Home from "../pages/public/Home"
import InvitacionPublica from "../pages/public/InvitacionPublica"
import CrearEvento from "../pages/private/CrearEvento"
import PublicLayout from "../components/layout/PublicLayout"
import MainLayout from "../components/layout/MainLayout"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import DemoTemplate from "../pages/public/DemoTemplate"

function AppRouter() {
  return (
    <Routes>
      {/* RUTAS PUBLICAS */}
      <Route element={<PublicLayout />}>

        <Route path="/" element={<Home />} />

        <Route
          path="/invitacion/:slug"
          element={<InvitacionPublica />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
         <Route
          path="/demo/:template"
          element={<DemoTemplate />}
        />

      </Route>

      
      <Route element={<MainLayout />}>

        <Route
          path="/crear-evento"
          element={
            <ProtectedRoute>
              <CrearEvento />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/evento/:id"
          element={
            <ProtectedRoute>
              <DashboardEvento />
            </ProtectedRoute>
          }
        />

      </Route>

    </Routes>
  )
}

export default AppRouter