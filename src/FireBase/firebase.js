// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCUW6ROiE0g71U2svkXUrVdvMriVoKKAaY",
  authDomain: "disploy.firebaseapp.com",
  projectId: "disploy",
  storageBucket: "disploy.appspot.com",
  messagingSenderId: "590831956653",
  appId: "1:590831956653:web:00a1b82e570071d1bf8c24",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
var auth = getAuth(app);
var Googleauthprovider = new GoogleAuthProvider();
var facebookProvider = new FacebookAuthProvider();
var appleProvider = new OAuthProvider("apple.com");
var microsoftProvider = new OAuthProvider("microsoft.com");

export {
  auth,
  Googleauthprovider,
  facebookProvider,
  appleProvider,
  microsoftProvider,
};
