import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc } 
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
    autor: userName,
    leido: false
  });

  input.value = "";
});

// Escuchar cambios en tiempo real y actualizar el timeline
const q = query(collection(db, "notas"), orderBy("fecha", "asc"));
onSnapshot(q, async (snapshot) => {
  timeline.innerHTML = "";

  for (const docSnap of snapshot.docs) {
    const note = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("note");

    const dateStr = note.fecha ? note.fecha.toDate().toLocaleString() : "Ahora";

    div.innerHTML = `
      <span class="author">${note.autor}:</span> 
      <span class="text">${note.texto}</span>
      <span class="date">${dateStr}</span>
      ${note.leido ? "<span class='note-read'>✔ Visto</span>" : ""}
    `;

    timeline.appendChild(div);

    // Marcar como leído si el mensaje es de otro usuario y aún no lo leyó
    if (!note.leido && note.autor !== userName) {
      const docRef = doc(db, "notas", docSnap.id);
      updateDoc(docRef, { leido: true }).catch(err => console.error(err));
    }
  }
});






