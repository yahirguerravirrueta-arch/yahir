// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔹 Configuración Firebase (usa la tuya)
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT.appspot.com",
  messagingSenderId: "ID",
  appId: "APP_ID"
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
  const email = usernameInput.value + "@diario.com"; // se convierte en email
  const password = passwordInput.value;

  try {
    // Intentar iniciar sesión
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = usernameInput.value;
    mostrarChat();
  } catch (error) {
    // Si falla, registrar
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      currentUser = usernameInput.value;
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

    // Diferenciar burbuja
    if (note.author === currentUser) {
      div.classList.add("mine");
    } else {
      div.classList.add("theirs");

      // Marcar como leído si no lo estaba
      if (!note.read) {
        updateDoc(doc(db, "notes", docSnap.id), { read: true });
      }
    }

    div.innerHTML = `
      <div class="author">${note.author}:</div>
      <div class="text">${note.text}</div>
      <span class="date">${note.timestamp?.toDate().toLocaleString() || ""}</span>
      ${note.read ? '<span class="note-read">✔ Visto</span>' : ""}
    `;

    timeline.appendChild(div);
  });
});

// 🔹 CONTADOR DE DÍAS JUNTOS ❤️
function actualizarContador() {
  const inicio = new Date("2024-06-01"); // 📌 cámbiala a tu fecha
  const hoy = new Date();
  const diffTime = Math.abs(hoy - inicio);
  const dias = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  document.getElementById("contador").textContent =
    `❤️ Llevamos ${dias} días juntos ❤️`;
}
actualizarContador();














