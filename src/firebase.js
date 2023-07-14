// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBuU5lhHxzQn3jhMKEE-grxgl8VfVCOr_M",
  authDomain: "chatservice-8a434.firebaseapp.com",
  projectId: "chatservice-8a434",
  storageBucket: "chatservice-8a434.appspot.com",
  messagingSenderId: "1005272518468",
  appId: "1:1005272518468:web:9b503d4de421980ee41111",
  measurementId: "G-P63YJT48S3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);