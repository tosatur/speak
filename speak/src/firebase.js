import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAFQhCXa-A7UAXJuKiEfbScme7uA5A6sp0",
    authDomain: "speak-9ef8b.firebaseapp.com",
    projectId: "speak-9ef8b",
    storageBucket: "speak-9ef8b.appspot.com",
    messagingSenderId: "747884083738",
    appId: "1:747884083738:web:cd81a9dba05a774a7e2fa3",
    measurementId: "G-PGLFN3CTHT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };