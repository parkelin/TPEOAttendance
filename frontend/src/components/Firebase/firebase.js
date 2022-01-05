// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCS2mutt4eUMeDaUECMvDYpBqm-lC7ti3M",
    authDomain: "tpeoattendance.firebaseapp.com",
    projectId: "tpeoattendance",
    storageBucket: "tpeoattendance.appspot.com",
    messagingSenderId: "866732197875",
    appId: "1:866732197875:web:9e948c15432ac4b18cf486",
    measurementId: "G-K3SBFBZ9HJ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export {auth, firebase};