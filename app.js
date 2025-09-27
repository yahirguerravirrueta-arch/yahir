import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, deleteDoc } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3Hpra0Ys2lXIYXB_C3PAC8dsVDd7cwyk",
  authDomain: "r-angell.firebaseapp.com",
  projectId: "r-angell",
  storageBucket: "r-angell.firebasestorage.app",
  messagingSenderId: "609120128775",
  appId: "1:609120128775:web:e4b90b051d988037f4ffa2",
  measurementId: "G-HZMH0MCHY2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Nombre del usuario
let userName = prompt("Escribe tu nombre o iniciales para el diario:");
if (!userName) userName = "Anon";

// DOM
const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const timeline = document.getElementById("timeline");
const chatBubble = document.getElementById("chat-bubble");
const chatWindow = document.getElementById("chat-window");

// Abrir/cerrar chat
chatBubble.addEventListener("click", () => {
  chatWindow.classList.toggle("hidden");
});

// Enviar mensaje
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  await addDoc(collection(db, "notas"), {
    texto: text,
    fecha: serverTimestamp(),
    leido: false,
    autor: userName
  });

  input.value = "";
});

// Mostrar mensajes
const q = query(collection(db, "notas"), orderBy("fecha", "asc"));
onSnapshot(q, (snapshot) => {
  timeline.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const note = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("note");

    const date = note.fecha ? note.fecha.toDate().toLocaleString() : "Ahora";

    // Diferenciar autor
    if (note.autor === userName) div.classList.add("my-note");
    else div.classList.add("other-note");

    div.innerHTML = `
      <p><strong>${note.autor}:</strong> ${note.texto}</p>
      <span class="note-date">${date}</span>
      ${note.leido ? "<span class='note-read'>✔ Visto</span>" : ""}
    `;

    // Editar/borrar solo si eres el autor
    if (note.autor === userName) {
      const editBtn = document.createElement("button");
      editBtn.textContent = "✏️";
      editBtn.onclick = async () => {
        const newText = prompt("Editar nota:", note.texto);
        if (newText) await updateDoc(doc(db, "notas", docSnap.id), { texto: newText });
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "🗑️";
      deleteBtn.onclick = async () => {
        if (confirm("¿Eliminar nota?")) await deleteDoc(doc(db, "notas", docSnap.id));
      };

      div.appendChild(editBtn);
      div.appendChild(deleteBtn);
    }

    timeline.appendChild(div);

    // Marcar como leído si es de otro usuario
    if (!note.leido && note.autor !== userName) {
      updateDoc(doc(db, "notas", docSnap.id), { leido: true });
    }
  });
});






