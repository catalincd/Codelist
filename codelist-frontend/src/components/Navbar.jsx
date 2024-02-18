import React, {useContext, useState, useEffect} from "react"
import { UserContext } from "../utils/UserContext";
import { Link, NavLink } from "react-router-dom";

const Navbar = (props) => {

    const { user, setUser } = useContext(UserContext);

    return (
        <div className="tile navbar">
            <h3>CODELIST</h3>
            <nav>
                <NavLink to="/" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Home</NavLink>
                <NavLink to="/probleme" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Probleme</NavLink>
                <NavLink to="/articole" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Articole</NavLink>
            </nav>
            {
                user? <p>User: {user?.username}</p> : <Link className="login" to="/login">Login</Link>
            }
        </div>)
}

export default Navbar