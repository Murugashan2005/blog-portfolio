// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAXJPBtAgCcqb7UIhRgvT4OO5V4NsmX5HQ",
  authDomain: "blog-app-35c28.firebaseapp.com",
  projectId: "blog-app-35c28",
  storageBucket: "blog-app-35c28.firebasestorage.app",
  messagingSenderId: "587032499620",
  appId: "1:587032499620:web:e7cbc1756b682b78829d31",
  measurementId: "G-S8PDVMVTVL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
