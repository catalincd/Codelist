import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../utils/UserContext";
import { Link, NavLink } from "react-router-dom";
import Cookies from 'universal-cookie';

const Navbar = (props) => {

    const { user, setUser } = useContext(UserContext);

    const cookies = new Cookies()

    const onLogout = () => {
        console.log("LOGIN OUT")
        cookies.remove('username', { path: '/' });
        cookies.remove('token', { path: '/' });
        setUser(null)
    }

    const loggedElement = <div className="logElement">
                            <p className="username">{user?.username}</p>
                            <button className="logout" onClick={() => onLogout()}>Log Out</button>
                        </div>

    const loginElement = <div className="logElement">
                            <Link className="signup" to="/signup">Sign up</Link>
                            <Link className="login" to="/login">Log in</Link>
                        </div>

    return (
        <div className="tile navbar">
            <h3>CODELIST</h3>
            <nav>
                <NavLink to="/" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Home</NavLink>
                <NavLink to="/probleme" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Probleme</NavLink>
                <NavLink to="/articole" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Articole</NavLink>
            </nav>
            {
                user ? loggedElement : loginElement
            }
        </div>)
}

export default Navbar