import axios from "axios"

const API_URL = "http://localhost:5000/api"

export const getEventoBySlug = async (slug) => {
  const response = await axios.get(`${API_URL}/eventos/slug/${slug}`)
  return response.data
}
export const createEvento = async (evento) => {
  const token = localStorage.getItem("token")

  const response = await axios.post(
    `${API_URL}/eventos`,
    evento,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  return response.data
}