import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAGAOpGdiFStfkGTyu-HRzWcbx4sgd9sh0",
  authDomain: "creditai-8ebde.firebaseapp.com",
  projectId: "creditai-8ebde",
  storageBucket: "creditai-8ebde.appspot.com",
  messagingSenderId: "965785692738",
  appId: "1:965785692738:web:1ca8b444af73d31a60dbdb",
  measurementId: "G-JWHTD8FZ2T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();