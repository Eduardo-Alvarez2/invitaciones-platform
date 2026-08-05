import { Routes, Route } from "react-router-dom"

import DashboardEvento from "../pages/private/DashboardEvento"
import Home from "../pages/public/Home"
import InvitacionPublica from "../pages/public/InvitacionPublica"
import PublicLayout from "../components/layout/PublicLayout"
import MainLayout from "../components/layout/MainLayout"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import DemoTemplate from "../pages/public/DemoTemplate"
import EditorInvitacion from "../pages/public/EditorInvitacion"
import EditorDetalle from "../pages/private/EditorDetalles"
import DashboardGeneral from "../pages/private/DashboardGeneral"
import Checkout from "../pages/private/Checkout"
import Terminos from "../pages/public/terminos"

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
          path="/demo/:template"
          element={<DemoTemplate />}
        />
        <Route
          path="/editor"
          element={<EditorInvitacion />}
         />

         <Route
          path="/terminos"
          element={<Terminos />}
         />
          <Route
          path="/checkout/:id"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />


      </Route>

      
      <Route element={<MainLayout />}>

        <Route
          path="/editor-detalle/:id?"
          element={
            <ProtectedRoute>
              <EditorDetalle />
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardGeneral />
            </ProtectedRoute>
          }
         />

      </Route>

    </Routes>
  )
}

export default AppRouter