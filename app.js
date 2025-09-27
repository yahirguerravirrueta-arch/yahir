import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3Hpra0Ys2lXIYXB_C3PAC8dsVDd7cwyk",
  authDomain: "r-angell.firebaseapp.com",
  projectId: "r-angell",
  storageBucket: "r-angell.firebasestorage.app",
  messagingSenderId: "609120128775",
  appId: "1:609120128775:web:e4b90b051d988037f4ffa2",
  measurementId: "G-HZMH0MCHY2"
};

// Inicializar Firebase y Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Pedir nombre al usuario
let userName = prompt("Ingresa tu nombre o iniciales para el diario:");
if (!userName) userName = "Anon";

// Referencias al DOM
const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const timeline = document.getElementById("timeline");

// Enviar mensaje
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "notas"), {
    texto: text,
    fecha: serverTimestamp(),
    autor: userName
  });

  input.value = "";
});

// Escuchar cambios en tiempo real y actualizar el timeline
const q = query(collection(db, "notas"), orderBy("fecha", "asc"));
onSnapshot(q, (snapshot) => {
  timeline.innerHTML = "";
  snapshot.forEach(doc => {
    const note = doc.data();
    const div = document.createElement("div");
    div.classList.add("note");

    // Convertir fecha
    const dateStr = note.fecha ? note.fecha.toDate().toLocaleString() : "Ahora";

    div.innerHTML = `
      <span class="author">${note.autor}:</span> 
      <span class="text">${note.texto}</span>
      <span class="date">${dateStr}</span>
    `;

    timeline.appendChild(div);
  });
});





