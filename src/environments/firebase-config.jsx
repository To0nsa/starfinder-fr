import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyAeKgklWZV5wf5iQ5HX14rGoaV28qqupVE",
  authDomain: "starfinder-fr.firebaseapp.com",
  projectId: "starfinder-fr",
  storageBucket: "starfinder-fr.appspot.com",
  messagingSenderId: "900946756335",
  appId: "1:900946756335:web:468bbda02059a0cbf3111a",
  measurementId: "G-5GGQL8J6YL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage }