import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../utils/UserContext";
import { Link, NavLink } from "react-router-dom";

import Image from "./Image"
import Utils from "../utils/Utils"



const Navbar = (props) => {

    const { user, setUser } = useContext(UserContext);

    const userProfileHref = `/user/${user?.username}`
    const userProfilePicture = Utils.GetUserPicture(user)

    const loggedElement = <div className="logElement in">
                            <Link to={userProfileHref} className="username">
                                {user?.username}
                                <Image src={userProfilePicture} altSrc={Utils.DefaultProfileImage}/>
                            </Link>
                        </div>

    const loginElement = <div className="logElement">
                            <Link className="signup" to="/signup">Sign up</Link>
                            <Link className="login" to="/login">Log in</Link>
                        </div>

    return (
        <div className="navbar tile">
            <Link className="home" to="/"><h3>CODELIST</h3></Link>
            <nav>
                <NavLink to="/problems" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Probleme</NavLink>
                <NavLink to="/articles" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Articole</NavLink>
                <NavLink to="/courses" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Cursuri</NavLink>
                <NavLink to="/quizzes" className={({ isActive, isPending }) => isPending ? "pending" : isActive ? "active" : ""}>Examene</NavLink>
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