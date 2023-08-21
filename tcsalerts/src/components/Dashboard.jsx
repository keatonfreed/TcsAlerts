import React, {useEffect, useCallback } from 'react'
import { useAuth } from "../contexts/AuthContext"
import './Dashboard.css'

// import Dropdown from 'react-dropdown';
// import 'react-dropdown/style.css';

import PhoneInput from 'react-phone-number-input/input'
import 'react-phone-number-input/style.css'


export default function Dashboard() {
    let { currentUser, logout, currentUserData,setCurrentUserData,updateUserData,userDataChanged } = useAuth()

    // const [displayName, setDisplayName] = useState(currentUserData?.displayName)
    // const [phoneNumber, setPhoneNumber] = useState(currentUserData?.phoneNumber)
    // const [calenderLink, setCalenderLink] = useState(currentUserData?.calenderLink)


    function saveUserData() {
        updateUserData(currentUserData)
    }

    const unloadUpdate = useCallback(e => {
      if(userDataChanged) {
          e.preventDefault()
          e.returnValue = ''
      }
    },[userDataChanged])
    useEffect(() => {
        window.addEventListener('beforeunload', unloadUpdate)
        return () => {
            window.removeEventListener('beforeunload', unloadUpdate)
        }
      }, [unloadUpdate])



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
                        <input type="text" placeholder='John Doe' className='themeInput' value={currentUserData?.displayName || ""}
                            onChange={(e) => setCurrentUserData({...currentUserData,displayName:e.target.value})}/>
                    </div>
                    <div className="setting">
                        <p>Phone Number</p>
                        <PhoneInput
                            international
                            defaultCountry="US"
                            country='US'
                            value={currentUserData?.phoneNumber || ""}
                            onChange={(num) => setCurrentUserData({...currentUserData,phoneNumber:num || ""})}
                            className="themeInput"
                            placeholder="999 999 9999" />
                    </div>
                    <div className="setting">
                        <p>Calender Link <button className='themeLink' popovertarget="calenderHelpDisplay">Help?</button></p>
                        <dialog popover="" id="calenderHelpDisplay" className='calenderHelpDialog'>
                            <h1>Help</h1>
                            <p>Your Tcs Calender Link is how we connect to the Tcs system for data.</p>
                            <h2>Step 1</h2>
                            <p>Click this <a target='_blank' rel="noreferrer" href='https://tcs-walnutcreek.pike13.com/'>link</a> (tcs-walnutcreek.pike13.com)</p>
                            <h2>Step 2</h2>
                            <p>Click the "Subscribe" button on the right</p>
                            <h2>Step 3</h2>
                            <p>Click the "Show Calender URL" link</p>
                            <h2>Step 4</h2>
                            <p>Copy the entire URL that appears in the box, and paste it into your dashboard here.</p>
                        </dialog>
                        <input placeholder='webcal:// ' type="text" className='themeInput' value={currentUserData?.calenderLink || ""}
                            onChange={(e) => setCurrentUserData({...currentUserData,calenderLink:e.target.value})}/>
                    </div>
                </div>
                <button disabled={!userDataChanged} className='themeButton saveButton' onClick={saveUserData}>
                    Save
                </button>
                {/* <p>{JSON.stringify(currentUserData)}</p> */}
            </main>
        </div>
    )
}
