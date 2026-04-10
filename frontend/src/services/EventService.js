import axios from "axios";

const API_URL = "http://localhost:5000/api";

// 🔐 helper token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
};

// =========================
// 🎯 EVENTO
// =========================

// 🔹 crear evento
export const createEvento = async (evento) => {
  const res = await axios.post(
    `${API_URL}/eventos`,
    evento,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// 🔹 obtener evento por id
export const getEventoById = async (id) => {
  const res = await axios.get(
    `${API_URL}/eventos/${id}`,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// 🔹 obtener evento público (slug)
export const getEventoBySlug = async (slug) => {
  const res = await axios.get(
    `${API_URL}/eventos/slug/${slug}`
  );

  return res.data;
};

// 🔹 actualizar evento
export const updateEvento = async (id, data) => {
  const res = await axios.put(
    `${API_URL}/eventos/${id}`,
    data,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// 🔹 eliminar evento
export const deleteEvento = async (id) => {
  const res = await axios.delete(
    `${API_URL}/eventos/${id}`,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// 🔹 activar / desactivar evento
export const toggleEvento = async (id, activo) => {
  const res = await axios.patch(
    `${API_URL}/eventos/${id}/estado`,
    { activo },
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// =========================
// 🖼️ PORTADA
// =========================

// 🔹 subir portada
export const uploadPortada = async (eventoId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_URL}/eventos/${eventoId}/portada`,
    formData,
    {
      headers: {
        ...getAuthHeaders()
      }
    }
  );

  return res.data;
};

// 🔹 eliminar portada
export const deletePortada = async (eventoId) => {
  const res = await axios.delete(
    `${API_URL}/eventos/${eventoId}/portada`,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// =========================
// 🖼️ GALERÍA
// =========================

// 🔹 subir imagen
export const uploadGaleria = async (eventoId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axios.post(
    `${API_URL}/eventos/${eventoId}/imagenes`,
    formData,
    {
      headers: {
        ...getAuthHeaders()
      }
    }
  );

  return res.data;
};

// 🔹 listar galería
export const getGaleria = async (eventoId) => {
  const res = await axios.get(
    `${API_URL}/eventos/${eventoId}/imagenes`,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// 🔹 eliminar imagen
export const deleteImagen = async (eventoId, imagenId) => {
  const res = await axios.delete(
    `${API_URL}/eventos/${eventoId}/imagenes/${imagenId}`,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// =========================
// 🕒 CRONOGRAMA
// =========================

// 🔹 crear item
export const createCronograma = async (eventoId, item) => {
  const res = await axios.post(
    `${API_URL}/eventos/${eventoId}/cronograma`,
    item,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};

// 🔹 listar cronograma
export const getCronograma = async (eventoId) => {
  const res = await axios.get(
    `${API_URL}/eventos/${eventoId}/cronograma`,
    {
      headers: getAuthHeaders()
    }
  );

  return res.data;
};