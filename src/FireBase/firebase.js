// Import the functions you need from the SDKs you need
import firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUW6ROiE0g71U2svkXUrVdvMriVoKKAaY",
  authDomain: "disploy.firebaseapp.com",
  projectId: "disploy",
  storageBucket: "disploy.appspot.com",
  messagingSenderId: "590831956653",
  appId: "1:590831956653:web:00a1b82e570071d1bf8c24"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
const storage = firebase.storage();

export { auth, storage };
