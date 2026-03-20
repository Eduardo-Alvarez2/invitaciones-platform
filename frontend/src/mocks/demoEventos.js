const generarFechaFutura = (dias = 30, hora = 21) => {
  const fecha = new Date();
  fecha.setDate(fecha.getDate() + dias);
  fecha.setHours(hora, 0, 0, 0);
  return fecha.toLocaleString("sv-SE").replace(" ", "T");
};

export const demoEventos = {
  classic: {
    nombre: "Sofía & Juan",
    fecha: generarFechaFutura(60, 21),
    lugar: "Salón Los Robles",
    direccion: "Av. Siempre Viva 123",
    mensaje_principal: "Te invitamos a celebrar nuestra boda 💍",

     cronograma: [
      { hora: "20:00", titulo: "Recepción", descripcion: "Bienvenida y recepción de invitados" },
      { hora: "21:00", titulo: "Ceremonia", descripcion: "Inicio de la ceremonia" },
      { hora: "22:30", titulo: "Cena", descripcion: "Servicio de cena" },
      { hora: "00:00", titulo: "Fiesta", descripcion: "¡A bailar!" }
    ]
  },
  
  modern: {
    nombre: "Emma",
    fecha: generarFechaFutura(30, 20),
    lugar: "Quinta La Esperanza",
    direccion: "Ruta 5 km 120",
    mensaje_principal: "Celebramos mis 15 🎉",

     cronograma: [
      { hora: "19:30", titulo: "Recepción", descripcion: "" },
      { hora: "21:00", titulo: "Entrada", descripcion: "Entrada principal" },
      { hora: "22:00", titulo: "Cena", descripcion: "" },
      { hora: "00:30", titulo: "Fiesta", descripcion: "" }
    ]
  },
  

  minimal: {
    nombre: "Bautismo de Mateo",
    fecha: generarFechaFutura(15, 11),
    lugar: "Parroquia San José",
    direccion: "Centro",
    mensaje_principal: "Te invitamos a acompañarnos en este momento especial ✨",

     cronograma: [
      { hora: "11:00", titulo: "Ceremonia", descripcion: "" },
      { hora: "12:30", titulo: "Almuerzo", descripcion: "" }
    ]
  }
};