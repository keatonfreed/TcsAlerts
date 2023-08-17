import React, { useContext, useState, useEffect } from "react"
import { auth, signInWithGooglePopup, db } from "../firebase"
import { collection, addDoc, getDocs } from "firebase/firestore";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [currentUserData, setCurrentUserData] = useState()
    const [loading, setLoading] = useState(true)


    function signInWithGoogle() {
        return signInWithGooglePopup()
    }

    function logout() {
        return auth.signOut()
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user)
            // if (user) {
            //     let newUserData = db
            //     setCurrentUserData(db)
            // } else {
            //     setCurrentUserData()
            // }
            setLoading(false)
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser,
        // currentUserData,
        signInWithGoogle, // Google login with popup
        logout,
        // db
    }



    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}