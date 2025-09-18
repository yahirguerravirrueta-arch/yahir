import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 TODO: Pega tu configuración de Firebase aquí
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

const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const timeline = document.getElementById("timeline");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (input.value.trim() === "") return;

  await addDoc(collection(db, "notas"), {
    texto: input.value,
    fecha: serverTimestamp()
  });

  input.value = "";
});

// 🔄 Escuchar cambios en tiempo real
const q = query(collection(db, "notas"), orderBy("fecha", "asc"));
onSnapshot(q, (snapshot) => {
  timeline.innerHTML = "";
  snapshot.forEach(doc => {
    const note = doc.data();
    const div = document.createElement("div");
    div.classList.add("note");
    div.textContent = note.texto;
    timeline.appendChild(div);
  });
});

