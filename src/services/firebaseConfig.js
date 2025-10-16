import { initializeApp } from "firebase/app";
// ANTES: import { getAuth } from 'firebase/auth';
// DEPOIS (CORRETO):
import { initializeAuth, getReactNativePersistence } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyAjn2O_hSxuAdWrHkefG0Y72l61k8nu2F4",
  authDomain: "app-vestquest.firebaseapp.com",
  projectId: "app-vestquest",
  storageBucket: "app-vestquest.firebasestorage.app",
  messagingSenderId: "9320893736",
  appId: "1:9320893736:web:79c74cc2d8710c28f2541d"
};

const app = initializeApp(firebaseConfig);

// Agora isso vai funcionar, porque as funções foram importadas corretamente
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export const db = getFirestore(app);
export { auth };
