import React, {useContext, useState, useEffect} from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Home from "../pages/Home"
import Login from "../pages/Login"

import { UserContext } from "./UserContext";

const Root = (props) => {

  const [user, setUser] = useState(null)


  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default Root