import React from 'react'
import { useNavigate } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <div className='NotFound'>
            <h1>404!</h1>
            <h2>Page Not Found</h2>
            <button className='themeButton' onClick={() => { navigate("/"); }}>Home Page</button>
        </div>
    )
}
