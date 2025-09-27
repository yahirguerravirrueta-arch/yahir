import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy, updateDoc, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

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
const auth = getAuth();

// DOM references
const loginDiv = document.getElementById("loginDiv");
const chatDiv = document.getElementById("chatDiv");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const nicknameInput = document.getElementById("nicknameInput");
const loginBtn = document.getElementById("loginBtn");
const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const timeline = document.getElementById("timeline");

// Login / Registro simplificado (sin verificación)
loginBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const nickname = nicknameInput.value.trim();

  if (!email || !password || !nickname) return alert("Completa todos los campos");

  let user;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    user = userCredential.user;
  } catch {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      user = userCredential.user;
      // Guardar apodo en Firestore
      await setDoc(doc(db, "usuarios", user.uid), { nickname });
    } catch (err) {
      return alert("Error: " + err.message);
    }
  }

  // Guardar o actualizar apodo
  await setDoc(doc(db, "usuarios", user.uid), { nickname }, { merge: true });
});

// Detectar usuario logueado
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
    startChat(user);
  } else {
    loginDiv.style.display = "block";
    chatDiv.style.display = "none";
  }
});

// Función principal del chat
function startChat(user) {
  // Enviar mensaje
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    await addDoc(collection(db, "notas"), {
      texto: text,
      fecha: serverTimestamp(),
      autorUID: user.uid,
      leido: false
    });

    input.value = "";
  });

  // Escuchar cambios en tiempo real
  const q = query(collection(db, "notas"), orderBy("fecha", "asc"));
  onSnapshot(q, async (snapshot) => {
    timeline.innerHTML = "";

    for (const docSnap of snapshot.docs) {
      const note = docSnap.data();
      const div = document.createElement("div");

      // Clase para estilo tipo WhatsApp
      div.classList.add("note", note.autorUID === user.uid ? "mine" : "theirs");

      const dateStr = note.fecha ? note.fecha.toDate().toLocaleString() : "Ahora";

      // Obtener apodo del autor
      let displayName = "Anon";
      const userDoc = await getDoc(doc(db, "usuarios", note.autorUID));
      if (userDoc.exists()) displayName = userDoc.data().nickname;

      div.innerHTML = `
        <span class="author">${displayName}:</span> 
        <span class="text">${note.texto}</span>
        <span class="date">${dateStr}</span>
        ${note.leido ? "<span class='note-read'>✔ Visto</span>" : ""}
      `;

      timeline.appendChild(div);

      // Marcar como leído si el mensaje es de otro usuario
      if (!note.leido && note.autorUID !== user.uid) {
        const docRef = doc(db, "notas", docSnap.id);
        updateDoc(docRef, { leido: true }).catch(err => console.error(err));
      }
    }
  });
}
















