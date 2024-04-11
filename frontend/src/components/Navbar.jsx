import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../utils/UserContext";
import { Link, NavLink } from "react-router-dom";

const Navbar = (props) => {

    const { user, setUser } = useContext(UserContext);

    const userProfileHref = `/user/${user?.username}`
    const userProfilePicture = `${process.env.REACT_APP_HOSTNAME}/images/${user && user.picture || "default.png"}`

    const loggedElement = <div className="logElement in">
                            <Link to={userProfileHref} className="username">
                                {user?.username}
                                <img src={userProfilePicture} />
                            </Link>
                        </div>

    const loginElement = <div className="logElement">
                            <Link className="signup" to="/signup">Sign up</Link>
                            <Link className="login" to="/login">Log in</Link>
                        </div>

    return (
        <div className="tile navbar">
            <Link className="home" to="/"><h3>CODELIST</h3></Link>
            <nav>
                <NavLink to="/problems" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Probleme</NavLink>
                <NavLink to="/articles" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Articole</NavLink>
                <NavLink to="/users" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Utilizatori</NavLink>
                {
                    user &&
                    <NavLink to="/newpost" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Postează</NavLink>
                }
            </nav>
            {
                user ? loggedElement : loginElement
            }
        </div>)
}

export default Navbar