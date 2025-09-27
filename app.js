import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } 
  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔥 Configuración de Firebase (mantén tu configuración original)
const firebaseConfig = {
  apiKey: "AIzaSyA3Hpra0Ys2lXIYXB_C3PAC8dsVDd7cwyk",
  authDomain: "r-angell.firebaseapp.com",
  projectId: "r-angell",
  storageBucket: "r-angell.firebasestorage.app",
  messagingSenderId: "609120128775",
  appId: "1:609120128775:web:e4b90b051d988037f4ffa2",
  measurementId: "G-HZMH0MCHY2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Referencias al DOM
const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const imageInput = document.getElementById("imageInput");
const timeline = document.getElementById("timeline");

// Enviar mensaje
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text && !imageInput.files[0]) return;

  let imageUrl = "";
  if (imageInput.files[0]) {
    const imageRef = ref(storage, `images/${Date.now()}_${imageInput.files[0].name}`);
    await uploadBytes(imageRef, imageInput.files[0]);
    imageUrl = await getDownloadURL(imageRef);
  }

  await addDoc(collection(db, "notas"), {
    texto: text,
    imagen: imageUrl,
    fecha: serverTimestamp(),
    leido: false
  });

  input.value = "";
  imageInput.value = "";
});

// Escuchar cambios en tiempo real
const q = query(collection(db, "notas"), orderBy("fecha", "asc"));
onSnapshot(q, (snapshot) => {
  timeline.innerHTML = "";
  snapshot.forEach(async (doc) => {
    const note = doc.data();
    const div = document.createElement("div");
    div.classList.add("note");

    const date = note.fecha ? note.fecha.toDate().toLocaleString() : "Ahora";

    div.innerHTML = `
      <p>${note.texto}</p>
      ${note.imagen ? `<img src="${note.imagen}" class="note-img">` : ""}
      <span class="note-date">${date}</span>
      ${note.leido ? "<span class='note-read'>✔ Visto</span>" : ""}
    `;

    // Botones para editar y borrar
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.onclick = async () => {
      const newText = prompt("Editar nota:", note.texto);
      if (newText) await doc.ref.update({ texto: newText });
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.onclick = async () => {
      if (confirm("¿Eliminar nota?")) await doc.ref.delete();
    };

    div.appendChild(editBtn);
    div.appendChild(deleteBtn);

    timeline.appendChild(div);

    // Marcar como leído
    if (!note.leido) {
      await doc.ref.update({ leido: true });
    }
  });
});



