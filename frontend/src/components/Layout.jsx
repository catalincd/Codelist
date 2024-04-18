import React, { useContext, useState, useEffect } from "react"
import Navbar from './Navbar'
import Footer from './Footer'
import TextButton from "../components/TextButton"

const Layout = (props) => {

    useEffect(() => {
        const timeoutId = (props.setError? setTimeout(() => props.setError(null), 3000) : -1)
        return () => clearTimeout(timeoutId)
    }, [props.error])

    const errorOverlay = (
        <div className="errorOverlay">
            <div className="errorMessageContainer">
                <p>{props.error}</p>
                <TextButton text="OK" styled={true} onClickHandle={() => props.setError(null)} />
            </div>
        </div>
    )

    return (
        <div className="mainLayout">
            {
                props.error && errorOverlay
            }
            <Navbar />
            <div className="mainLayoutContent">
                {props.children}
            </div>
            <Footer />
        </div>
    );
}



export default Layout