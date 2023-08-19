import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

const app = initializeApp({
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
})

export const auth = getAuth(app);
export const signInWithGooglePopup = () => {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({
        prompt: 'select_account',
    });
    return signInWithPopup(auth, provider)
};
// export const db = getFirestore(app);
export default app
