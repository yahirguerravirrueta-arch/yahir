// 🔹 CONTADOR DE DÍAS JUNTOS ❤️
function actualizarContador() {
  // 📌 Cambia esta fecha al día que quieras que empiece en "Día 1"
  const inicio = new Date("2025-09-27"); 
  const hoy = new Date();

  // Calcular diferencia en días (redondeada hacia abajo)
  const diffTime = hoy.setHours(0,0,0,0) - inicio.setHours(0,0,0,0);
  const dias = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 porque el inicio cuenta como Día 1

  document.getElementById("contador").textContent =
    `❤️ Hoy es el Día ${dias} juntos ❤️`;
}

// Ejecutar al cargar
actualizarContador();

// Volver a calcular a medianoche automáticamente
function programarActualizacion() {
  const ahora = new Date();
  const msHastaMedianoche =
    new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate() + 1, 0, 0, 0) - ahora;

  setTimeout(() => {
    actualizarContador();
    programarActualizacion();
  }, msHastaMedianoche);
}
programarActualizacion();











