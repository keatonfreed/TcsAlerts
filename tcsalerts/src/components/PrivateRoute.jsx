import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children, reject }) {
    const { currentUser } = useAuth()
    return currentUser ? children : <Navigate to={reject || "/sign-in"} replace />
}
