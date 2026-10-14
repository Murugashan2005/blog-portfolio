import "./Navbar.css"
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import auth from '../../config/firebase';
import React, { useState, useEffect } from 'react';
import { signOut } from "firebase/auth";

function Navbar() {
    const navigate = useNavigate()
    const [log, setLog] = useState(false)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(function (user) {
            if (user) {
                setLog(true)
                console.log("User Logged In")
            }
            else {
                setLog(false)
                console.log("User Logged Out")
            }
        })
        return () => unsubscribe()
    }, [])

    function logout() {
        signOut(auth)
    }

    return (
        <div className='py-4 md:py-5 px-2 flex flex-wrap justify-between items-center gap-y-2'>
            <h2 className='text-xl md:text-2xl font-bold'>Personal</h2>
            <div className='flex flex-wrap items-center'>
                <Link className='list-none px-2 md:px-5' to={"/home"}>Home</Link>
                <Link className='list-none px-2 md:px-5' to={"/blogs"}>Blogs</Link>
                <Link className='list-none px-2 md:px-5' to={"/home"}>About</Link>

                {
                    log
                        ? <button className='button-style' onClick={logout}>Logout</button>
                        : <button className='button-style' onClick={() => navigate("/login")}>Login</button>
                }
            </div>
        </div>
    )
}

export default Navbar