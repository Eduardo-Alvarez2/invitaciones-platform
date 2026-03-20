import { Outlet } from "react-router-dom"

function PublicLayout() {
  return (
    <div className="w-full min-h-screen">
      <Outlet />
    </div>
  )
}

export default PublicLayout