// Import the functions you need from the SDKs you need
import firebase from "firebase";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjQZC339BCgAsJHr8M_-Dd4OCUnpKQsBc",
  authDomain: "disploy-test.firebaseapp.com",
  projectId: "disploy-test",
  storageBucket: "disploy-test.appspot.com",
  messagingSenderId: "656244737851",
  appId: "1:656244737851:web:49c5b95133114985e3991e",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var auth = firebase.auth();
var Googleauthprovider = new firebase.auth.GoogleAuthProvider();
var facebookProvider = new firebase.auth.FacebookAuthProvider();
var appleProvider = new firebase.auth.OAuthProvider("apple.com");
var microsoftProvider = new firebase.auth.OAuthProvider("microsoft.com");

export {
  auth,
  Googleauthprovider,
  facebookProvider,
  appleProvider,
  microsoftProvider,
};
