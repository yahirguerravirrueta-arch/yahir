import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔥 TODO: Pega tu configuración de Firebase aquí
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROJECT_ID.firebaseapp.com",
  projectId: "TU_PROJECT_ID",
  storageBucket: "TU_PROJECT_ID.appspot.com",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
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
