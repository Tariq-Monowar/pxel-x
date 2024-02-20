import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBLXxvPJdpw4NCvTNN_P5uv7h8yFtRlzX0",
  authDomain: "pxel-x-852a3.firebaseapp.com",
  projectId: "pxel-x-852a3",
  storageBucket: "pxel-x-852a3.appspot.com",
  messagingSenderId: "110840753413",
  appId: "1:110840753413:web:5020b7336f95f765a4db6c",
  measurementId: "G-SJQHMPWY5L"
};

export const firebaseApp = initializeApp(firebaseConfig);

//https://firebase.google.com/docs/auth/admin/manage-users?hl=bn#node.js_9
//https://firebase.google.com/docs/admin/setup?hl=bn#node.js_1