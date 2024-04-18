import React, {useContext, useState, useEffect} from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Cookies from 'universal-cookie'
import Requests from "../utils/Requests"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Problems from "../pages/Problems"
import Articles from "../pages/Articles"
import Solver from "../pages/Solver"
import Reader from "../pages/Reader"
import Confirmation from "../pages/Confirmation"
import PasswordReset from "../pages/PasswordReset"
import ForgotPassword from "../pages/ForgotPassword"
import Profile from "../pages/Profile"
import NewPost from "../pages/NewPost"
import SubmitArticle from "../pages/SubmitArticle"
import SubmitProblem from "../pages/SubmitProblem"

import { UserContext } from "./UserContext";

const Root = (props) => {

  const cookies = new Cookies(null, { path: '/', sameSite: "strict", expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // one week later
  const [user, setUser] = useState(cookies.get("USER_COOKIE") || null)

  useEffect(() => {
    user && cookies.set("USER_COOKIE", JSON.stringify(user))
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="problems" element={<Problems />} />
          <Route path="articles" element={<Articles />} />
          <Route path="forgot" element={<ForgotPassword />} />
          <Route path="newpost" element={<NewPost />} />
          <Route path="/new/article" element={<SubmitArticle />} />
          <Route path="/new/problem" element={<SubmitProblem />} />
          <Route exact path="/password/:username/:token" element={<PasswordReset />} />
          <Route exact path="/confirmation/:token" element={<Confirmation />} />
          <Route exact path="/problem/:id" element={<Solver />} />
          <Route exact path="/article/:id" element={<Reader />} />
          <Route exact path="/user/:name" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default Root