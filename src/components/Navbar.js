import React, { useState } from "react"
import { useAuth } from '../contexts/AuthContext';
import { Card, Button, Alert } from "react-bootstrap"
import { Link, useHistory } from "react-router-dom"

export const Navbar = () => {

    const [error, setError] = useState("")
    const { currentUser, logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")
    
        try {
          await logout()
          history.push("/login")
        } catch {
          setError("Failed to log out")
        }
      }

    function PrivateComponent({children}) {
        const {currentUser} = useAuth()
        return currentUser? children : null
    }

    return (
        <header>
            <PrivateComponent>
                <nav className='header'>
                    <div className="logo">
                        <Link to="/">IBDb: InternetBookDatabase</Link>
                    </div>
                    <div className="menu">
                        <div className="link">
                            <Link to="/library">Library</Link>
                            <div className="bar"></div>
                        </div>
                        <div className="link">
                            <Link to="/profile">Profile</Link>
                            <div className="bar"></div>
                        </div>
                        <div className="link">
                            <a href="#" onClick={handleLogout}>
                                Log Out
                            </a>
                            <div className="bar"></div>
                        </div>
                    </div>
                </nav>

            </PrivateComponent>
        </header>
    );
};