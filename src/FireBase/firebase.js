// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

// const firebaseConfig = {
//   apiKey: "AIzaSyCUW6ROiE0g71U2svkXUrVdvMriVoKKAaY",
//   authDomain: "disploy.firebaseapp.com",
//   projectId: "disploy",
//   storageBucket: "disploy.appspot.com",
//   messagingSenderId: "590831956653",
//   appId: "1:590831956653:web:00a1b82e570071d1bf8c24",
// };

// Darshak Ramani

const firebaseConfig = {
  apiKey: "AIzaSyC0bAybXL1wyaimF1U-q2BGFCyJ0i1ozDU",
  authDomain: "disploy-1658d.firebaseapp.com",
  projectId: "disploy-1658d",
  storageBucket: "disploy-1658d.appspot.com",
  messagingSenderId: "86375534567",
  appId: "1:86375534567:web:0b67d39bdb85cc775eb742",
  measurementId: "G-23N5DDZMD3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var firestore = getFirestore(app);
var database = getDatabase(app);
var Googleauthprovider = new GoogleAuthProvider();
var facebookProvider = new FacebookAuthProvider();
var appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope('email');
appleProvider.addScope('name');
var microsoftProvider = new OAuthProvider("microsoft.com");

export {
  auth,
  Googleauthprovider,
  facebookProvider,
  appleProvider,
  microsoftProvider,
  firestore,
  database,
};
