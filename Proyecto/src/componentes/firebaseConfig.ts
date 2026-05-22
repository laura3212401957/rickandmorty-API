import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
const firebaseConfig = {
apiKey: "AIzaSyDqS5-HzYvzrYLQ4WnDeGQ6bMS_KodALyI",
authDomain: "rickandmortyapi-fcf75.firebaseapp.com",
projectId: "rickandmortyapi-fcf75",
storageBucket: "rickandmortyapi-fcf75.firebasestorage.app",
messagingSenderId: "436198289441",
appId: "1:436198289441:web:a04bf354ae8fa669627360"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);
export { auth, db };