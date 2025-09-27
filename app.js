// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Tu configuración de Firebase (pon la de tu proyecto)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};

// Inicializar
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Variables
let usuarioActual = null;

// Elementos del DOM
const loginForm = document.getElementById("loginForm");
const chatDiv = document.getElementById("chat");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const timeline = document.getElementById("timeline");

// Login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  usuarioActual = document.getElementById("username").value.trim();
  if (usuarioActual) {
    loginForm.style.display = "none";
    chatDiv.style.display = "block";
  }
});

// Enviar mensaje
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const texto = noteInput.value.trim();
  if (texto && usuarioActual) {
    await addDoc(collection(db, "notas"), {
      usuario: usuarioActual,
      mensaje: texto,
      fecha: serverTimestamp()
    });
    noteInput.value = "";
  }
});

// Mostrar mensajes en tiempo real
const q = query(collection(db, "notas"), orderBy("fecha"));
onSnapshot(q, (snapshot) => {
  timeline.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    const fecha = data.fecha?.toDate().toLocaleString() || "⏳";
    const div = document.createElement("div");
    div.classList.add("note");
    div.innerHTML = `
      <strong>${data.usuario}:</strong> ${data.mensaje}
      <div class="meta">${fecha}</div>
    `;
    timeline.appendChild(div);
  });
});























