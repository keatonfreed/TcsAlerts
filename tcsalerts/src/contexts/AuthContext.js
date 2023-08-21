import React, { useContext, useState, useEffect } from "react"
import { auth, signInWithGooglePopup, db } from "../firebase"
import { updateDoc, setDoc, doc,getDoc } from "firebase/firestore";

const AuthContext = React.createContext()

export function useAuth() {
    return useContext(AuthContext)
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState()
    const [savedUserData, setSavedUserData] = useState()
    const [currentUserData, setCurrentUserData] = useState()
    const [loading, setLoading] = useState(true)

    const [userDataChanged, setUserDataChanged] = useState(false)

    function shallowEqual(object1, object2) {
        if (!object1 || !object2) {
          return false;
        }
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
      
        if (keys1.length !== keys2.length) {
          return false;
        }
      
        for (let key of keys1) {
          if (object1[key] !== object2[key]) {
            return false;
          }
        }
      
        return true;
      }

    useEffect(()=>{
        setUserDataChanged(!shallowEqual(currentUserData,savedUserData))
    },[currentUserData,savedUserData])

    function signInWithGoogle() {
        return signInWithGooglePopup()
    }

    function logout() {
        return auth.signOut()
    }

    async function updateUserData(updateData) {
        console.log("updating with:",updateData)
        await updateDoc(doc(db,"users",currentUser.uid),updateData)
        setSavedUserData({...savedUserData,...updateData})
        console.log("Updated User Data.")
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async user => {
            setCurrentUser(user)
            console.log("Updated User Auth:",user)
            if (user) {
                const userDataRef = doc(db,"users",user.uid)
                let userData = await getDoc(userDataRef)
                if (!userData.exists()) {
                    console.log("No User Data, Generating.")
                    let userTemplate = {
                        displayName:user.displayName || "",
                        phoneNumber:user.phoneNumber || "",
                        calenderLink:"",
                    }
                    await setDoc(userDataRef,userTemplate)
                    userData = await getDoc(userDataRef)
                    console.log("Finished Generating, Output:",userData)
                }
                console.log("User Data:",userData.data())
                setCurrentUserData(userData.data())
                setSavedUserData(userData.data())
            } else {
                setSavedUserData()
                setCurrentUserData()
            }
            setLoading(false)
        })

        return unsubscribe
    }, [])


    const value = {
        currentUser,
        currentUserData,
        setCurrentUserData,
        userDataChanged,
        updateUserData,
        signInWithGoogle,
        logout,
        // db
    }



    return (
        <AuthContext.Provider value={value}>
            {loading ? <div className="LoadingIcon"></div> : children}
        </AuthContext.Provider>
    )
}