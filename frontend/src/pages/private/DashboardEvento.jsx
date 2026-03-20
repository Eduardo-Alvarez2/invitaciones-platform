import { useParams } from "react-router-dom"

function DashboardEvento() {

  const { id } = useParams()

  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-2xl">
        Dashboard del evento {id}
      </h1>
    </div>
  )
}

export default DashboardEvento