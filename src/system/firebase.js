import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

 const firebaseConfig = {
  apiKey: "AIzaSyDbyjhid77moxivkJkxz3G-PGaHzkwujpA",
  authDomain: "d-game-1cf19.firebaseapp.com",
  projectId: "d-game-1cf19",
  storageBucket: "d-game-1cf19.firebasestorage.app",
  messagingSenderId: "762618484645",
  appId: "1:762618484645:web:94dfb8b90603133ba9fa4c"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);                               //all above is firebase code 


export async function submitScore(name, score) {
  console.log("Firebase: Attempting to submit score:", name, score);  // Add this
  try {
    await addDoc(collection(db, "scores"), {
      name,
      score,
      time: Date.now()                                         //sending score
    });
    console.log("Firebase: Score submitted successfully to Firestore");  // Add this
  } catch (e) {
    console.error("Error adding score:", e);
    throw e;
  }
}

export async function getLeaderboard() {
  const q = query(
    collection(db, "scores"),
    orderBy("score", "desc"),
    limit(10)                                         //get leaderboard daaata
  );

  const snapshot = await getDocs(q);

  let scores = [];
  snapshot.forEach(doc => {
    scores.push(doc.data());
  });

  return scores;
}