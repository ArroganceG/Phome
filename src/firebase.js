import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDPnLw9q4dajhFpo0XFY0zfFrMZ50QXpKg",
  authDomain: "phome-f805a.firebaseapp.com",
  projectId: "phome-f805a",
  storageBucket: "phome-f805a.firebasestorage.app",
  messagingSenderId: "762104155788",
  appId: "1:762104155788:web:4844b4bd1b316f2205b5a9",
  measurementId: "G-PS5LJY6QEF"
}

const app = initializeApp(firebaseConfig)

export const storage = getStorage(app)
export const db = getFirestore(app)
export const auth = getAuth(app)

export default app