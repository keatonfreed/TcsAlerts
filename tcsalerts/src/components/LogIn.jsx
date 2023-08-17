import React from "react"
import { useAuth } from "../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import './LogIn.css'
import GoogleButton from 'react-google-button'

export default function LogIn() {
    const { signInWithGoogle } = useAuth()
    // const [error, setError] = useState("")
    // const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    async function handleGoogleButton(e) {
        e.preventDefault()

        try {
            // setError("")
            // setLoading(true)
            await signInWithGoogle()
            navigate("/")
        } catch (err) {
            console.log("EXTERNAL ERROR: " + err)
            // setError(("Failed to create an account:", JSON.stringify(err)))
        }

        // setLoading(false)
    }

    return (
        <div className="LogIn">
            <h1>Sign In</h1>
            <h2>We currently only support Google accounts, but feel free to contact support with any issues.</h2>
            {/* {error && <h2>{error}</h2>} */}
            <GoogleButton onClick={handleGoogleButton} />
        </div>
    )
}