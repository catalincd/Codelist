import React, {useContext, useState, useEffect} from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cookies from 'universal-cookie';

import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Problems from "../pages/Problems"
import Solver from "../pages/Solver"

import { UserContext } from "./UserContext";

const Root = (props) => {

  const cookies = new Cookies()

  const usernameCookie = cookies.get("username")
  const tokenCookie = cookies.get("token")
    
  const newUser = (usernameCookie && tokenCookie)? {username: usernameCookie, token: tokenCookie}:null
  
  const [user, setUser] = useState(newUser)


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="problems" element={<Problems />} />
          <Route path="solver" element={<Solver />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default Root