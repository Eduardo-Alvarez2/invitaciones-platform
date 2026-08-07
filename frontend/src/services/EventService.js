import axios from "axios";

const API_URL = import.meta.env.PROD 
  ? "https://invitto.cloud/api" 
  : "http://localhost:5000/api";

// ==========================================
// 🔐 CONFIGURACIÓN DEL INTERCEPTOR DE REFRESH TOKEN
// ==========================================

// Creamos una instancia interna de axios para que maneje las llamadas de este servicio
export const api = axios.create({
  baseURL: API_URL,
});

// 1. Interceptor de Peticiones: Pega el token común automáticamente antes de que salga la llamada
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Interceptor de Respuestas: Atrapa el error 401 y renueva el token vencido en segundo plano
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si el backend nos rebota con un 401 (Token de acceso vencido)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Evita bucles infinitos si algo falla

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No hay refresh token.");

        // Le pegamos a la nueva ruta de Flask usando el axios original (para no pisar headers)
        const response = await axios.post(
          `${API_URL}/refresh`,
          {},
          { headers: { Authorization: `Bearer ${refreshToken}` } }
        );

        const nuevoAccessToken = response.data.access_token;

        // Guardamos el nuevo token de acceso para las próximas veces
        localStorage.setItem("token", nuevoAccessToken);

        // Se lo clavamos a la petición original que se había trabado
        originalRequest.headers.Authorization = `Bearer ${nuevoAccessToken}`;

        // Volvemos a lanzar la petición del usuario automáticamente
        return api(originalRequest);

      } catch (refreshError) {
        console.error("El Refresh Token también venció. Forzando logout.");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/"; // Te manda al Home para loguearte de cero
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


// ==========================================
// 🎯 FUNCIONES DEL SERVICIO (EVENTOS)
// ==========================================

// 🔹 crear evento
export const createEvento = async (evento) => {
  // Ahora usamos 'api.post' en vez de 'axios.post'. Ya no lleva los headers manuales.
  const res = await api.post("/eventos", evento);
  return res.data;
};

// 🔹 obtener evento por id
export const getEventoById = async (id) => {
  const res = await api.get(`/eventos/${id}`);
  return res.data;
};

// 🔹 obtener evento público (slug)
export const getEventoBySlug = async (slug) => {
  const res = await api.get(`/eventos/slug/${slug}`);
  return res.data;
};

// 🔹 actualizar evento
export const updateEvento = async (id, data) => {
  const res = await api.put(`/eventos/${id}`, data);
  return res.data;
};

// 🔹 eliminar evento
export const deleteEvento = async (id) => {
  const res = await api.delete(`/eventos/${id}`);
  return res.data;
};

// 🔹 activar / desactivar evento
export const toggleEvento = async (id, activo) => {
  const res = await api.patch(`/eventos/${id}/estado`, { activo });
  return res.data;
};

// =========================
// 🖼️ PORTADA
// =========================

// 🔹 subir portada
export const uploadPortada = async (eventoId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(`/eventos/${eventoId}/portada`, formData);
  return res.data;
};

// 🔹 eliminar portada
export const deletePortada = async (eventoId) => {
  const res = await api.delete(`/eventos/${eventoId}/portada`);
  return res.data;
};

// =========================
// 🖼️ GALERÍA
// =========================

// 🔹 subir imagen
export const uploadGaleria = async (eventoId, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(`/eventos/${eventoId}/imagenes`, formData);
  return res.data;
};

// 🔹 listar galería
export const getGaleria = async (eventoId) => {
  const res = await api.get(`/eventos/${eventoId}/imagenes`);
  return res.data;
};

// 🔹 eliminar imagen
export const deleteImagen = async (eventoId, imagenId) => {
  const res = await api.delete(`/eventos/${eventoId}/imagenes/${imagenId}`);
  return res.data;
};

// =========================
// 🕒 CRONOGRAMA
// =========================

// 🔹 crear item
export const createCronograma = async (eventoId, item) => {
  const res = await api.post(`/eventos/${eventoId}/cronograma`, item);
  return res.data;
};

// 🔹 listar cronograma
export const getCronograma = async (eventoId) => {
  const res = await api.get(`/eventos/${eventoId}/cronograma`);
  return res.data;
};

// 🔹 Sincronizar cronograma completo (Agregá esta que te faltaba)
export const syncCronograma = async (eventoId, items) => {
  const res = await api.post(`/eventos/${eventoId}/cronograma/sync`, { items });
  return res.data;
};

// ==========================================
// 🔐 FUNCIONES DEL SERVICIO (AUTENTICACIÓN)
// ==========================================

// Iniciar Sesión
export const loginUsuario = async (email, password) => {
  const res = await api.post("/login", { email, password });
  return res.data; 
};

// Registrar Usuario
export const registrarUsuario = async (nombre, email, password) => {
  const res = await api.post("/register", { nombre, email, password });
  return res.data;
};

// Verificar Código de 6 dígitos
export const verificarCuenta = async (email, codigo) => {
  const res = await api.post("/verify", { email, codigo });
  return res.data;
};

// Reenviar Código de activación
export const reenviarCodigoAuth = async (email) => {
  const res = await api.post("/resend-code", { email });
  return res.data;
};

// Solicitar código de recuperación
export const solicitarRecuperacion = async (email) => {
  try {
    const response = await api.post('/forgot-password', { email });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al solicitar el código de recuperación.';
  }
};

// Restablecer la contraseña con el código
export const restablecerPassword = async (email, codigo, password) => {
  try {
    const response = await api.post('/reset-password', { 
      email, 
      codigo, 
      password 
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Error al restablecer la contraseña.';
  }
};

// =========================
// 🎵 MÚSICA DE FONDO (Agregá esta sección nueva)
// =========================

// 🔹 Subir pista de audio
export const uploadMusica = async (eventoId, file) => {
  const formData = new FormData();
  formData.append("cancion", file); // Tu backend Flask lo recibe como 'cancion'

  // Al usar 'api', el interceptor ya le clava el token solito
  const res = await api.post(`/eventos/${eventoId}/musica`, formData);
  return res.data;
};