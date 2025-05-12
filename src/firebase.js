import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkpbjwal9gEqE3MGxY7J7HuEFe9hvL1nw",
  authDomain: "react-g-drive.firebaseapp.com",
  projectId: "react-g-drive",
  storageBucket: "react-g-drive.firebasestorage.app",
  messagingSenderId: "108383582459",
  appId: "1:108383582459:web:035dd9dbb896ae1877185e"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

export { auth, provider, db };
