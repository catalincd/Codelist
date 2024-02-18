import React, {useContext, useState, useEffect} from "react"
import Navbar from './Navbar' 
import Footer from './Footer' 

const Layout = (props) => {
    return(
        <div className="mainLayout">
            <Navbar />
            <div className="mainLayoutContent">
                {props.children}
            </div>
            <Footer />
        </div>
    );   
}



export default Layout