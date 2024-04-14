import React, { useContext, useState, useEffect } from "react"
import Navbar from './Navbar'
import Footer from './Footer'
import TextButton from "../components/TextButton"

const Layout = (props) => {

    useEffect(() => props.setError && clearTimeout(setTimeout(() => props.setError(null), 10000)), [props.error])

    const errorOverlay = (
        <div className="errorOverlay">
            <div className="errorMessageContainer">
                <p>{props.error}</p>
                <TextButton text="OK" width={3.25} onClickHandle={() => props.setError(null)} />
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