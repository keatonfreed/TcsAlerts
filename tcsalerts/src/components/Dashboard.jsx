import React, { useState } from 'react'
import { useAuth } from "../contexts/AuthContext"
import './Dashboard.css'

// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'


export default function Dashboard() {
    let { currentUser, logout } = useAuth()

    // const options = [
    //     'Verizon', 'Tmobile', 'Sprint'
    // ];
    // const defaultOption = options[0];

    // function changedDropdown(event) {
    //     console.log("changed:", event)
    // }

    // `value` will be the parsed phone number in E.164 format.
    // Example: "+12133734253".
    const [number, setNumber] = useState()

    function calLinkHelp(e) {

    }

    return (
        <div className='Dashboard'>
            <nav>
                <div className="profile">
                    <img src={currentUser?.photoURL} alt="none"></img>
                    <span>{currentUser?.displayName || "none"}</span>
                </div>
                <h1>Dashboard</h1>
                <div className="logout">
                    <button onClick={logout}>Log out</button>
                </div>
            </nav>
            <main>
                {/* <Dropdown className='themeDropdown' controlClassName='themeDropdownControl' options={options} onChange={changedDropdown} placeholder="Select a Carrier" /> */}
                <div className="grid">
                    <div className="setting">
                        <p>First/Last Name</p>
                        <input type="text" placeholder='John Doe' className='themeInput' />
                    </div>
                    <div className="setting">
                        <p>Phone Number</p>
                        <PhoneInput
                            international
                            defaultCountry="US"
                            country='US'
                            value={number}
                            onChange={setNumber}
                            className="themeInput"
                            placeholder="999 999 9999" />
                    </div>
                    <div className="setting">
                        <p>Calender Link <button className='themeLink' onClick={calLinkHelp}>Help?</button></p>
                        <input placeholder='webcal:// ' type="text" className='themeInput' />
                    </div>
                </div>
            </main>
        </div>
    )
}
