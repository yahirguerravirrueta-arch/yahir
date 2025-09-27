// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const auth = getAuth(app);

const loginDiv = document.getElementById("loginDiv");
const chatDiv = document.getElementById("chatDiv");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("usernameInput");
const passwordInput = document.getElementById("passwordInput");
const noteForm = document.getElementById("noteForm");
const noteInput = document.getElementById("noteInput");
const timeline = document.getElementById("timeline");

let currentUser = null;

// 🔹 LOGIN / REGISTER
loginBtn.addEventListener("click", async () => {
  const username = usernameInput.value;
  const password = passwordInput.value;

  if (!username || !password) {
    alert("Por favor ingresa un usuario y contraseña");
    return;
  }

  // Generamos un "correo falso" para Firebase Auth
  const email = username + "@diario.com";

  try {
    // Intentar login
    await signInWithEmailAndPassword(auth, email, password);
    currentUser = username;
    mostrarChat();
  } catch (error) {
    // Si falla, registrar
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      currentUser = username;
      mostrarChat();
    } catch (e) {
      alert("Error: " + e.message);
    }
  }
});

function mostrarChat() {
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";
}

// 🔹 ENVIAR MENSAJE
noteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!currentUser) return;

  await addDoc(collection(db, "notes"), {
    text: noteInput.value,
    author: currentUser,
    timestamp: serverTimestamp(),
    read: false
  });

  noteInput.value = "";
});

// 🔹 ESCUCHAR MENSAJES
const q = query(collection(db, "notes"), orderBy("timestamp", "desc"));
onSnapshot(q, (snapshot) => {
  timeline.innerHTML = "";
  snapshot.forEach((docSnap) => {
    const note = docSnap.data();
    const div = document.createElement("div");
    div.classList.add("note");

    div.innerHTML = `
      <div class="author">${note.author}:</div>
      <div class="text">${note.text}</div>
      <span class="date">${note.timestamp?.toDate().toLocaleString() || ""}</span>
      ${note.read ? '<span class="note-read">✔ Visto</span>' : ""}
    `;

    // Marcar como leído si es de otra persona
    if (note.author !== currentUser && !note.read) {
      updateDoc(doc(db, "notes", docSnap.id), { read: true });
    }

    timeline.appendChild(div);
  });
});

// 🔹 CONTADOR DE DÍAS JUNTOS ❤️
function actualizarContador() {
  // 📌 Cambia esta fecha al día que quieras que empiece en "Día 1"
  const inicio = new Date("2025-09-27");
  const hoy = new Date();

  // Diferencia en días
  const diffTime = hoy.setHours(0,0,0,0) - inicio.setHours(0,0,0,0);
  const dias = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

  document.getElementById("contador").textContent =
    `❤️ Hoy es el Día ${dias} juntos ❤️`;
}

actualizarContador();

// Recalcular a medianoche
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











