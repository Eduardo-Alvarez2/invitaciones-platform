import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getEventoBySlug } from "../../services/EventService"

import Template from "../../templates/Template"

function InvitacionPublica() {

  const { slug } = useParams()

  const [evento, setEvento] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchEvento = async () => {
    try {
      const data = await getEventoBySlug(slug)
      console.log(data)
      setEvento(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  fetchEvento()
}, [slug])

  if (loading) return <div>Cargando...</div>

  return <Template evento={evento} />
}

export default InvitacionPublica