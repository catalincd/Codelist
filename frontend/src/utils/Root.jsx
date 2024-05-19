import React, {useContext, useState, useEffect} from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Cookies from 'universal-cookie'
import Requests from "../utils/Requests"

import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import Problems from "../pages/Problems"
import Articles from "../pages/Articles"
import Quizzes from "../pages/Quizzes"
import Solver from "../pages/Solver"
import Reader from "../pages/Reader"
import Confirmation from "../pages/Confirmation"
import PasswordReset from "../pages/PasswordReset"
import ForgotPassword from "../pages/ForgotPassword"
import Profile from "../pages/Profile"
import NewPost from "../pages/NewPost"
import SubmitArticle from "../pages/SubmitArticle"
import SubmitProblem from "../pages/SubmitProblem"
import QuizSolver from "../pages/QuizSolver"
import QuizViewer from "../pages/QuizViewer"
import GoogleCallback from "../pages/GoogleCallback"

import { UserContext } from "./UserContext";


const Root = (props) => {

  const cookies = new Cookies(null, { path: '/', sameSite: "strict", expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // one week later
  const sessionData = sessionStorage.getItem("USER_DATA")
  const cookieData = cookies.get("USER_COOKIE") == undefined? null : {token: cookies.get("USER_COOKIE")}
  const [user, setUser] = useState(sessionData? JSON.parse(sessionData) : cookieData)

  useEffect(() => {
    user && cookies.set("USER_COOKIE", user.token)
    user && sessionStorage.setItem("USER_DATA", JSON.stringify(user))
    user && (user.username || Requests.LoginFromCookie(setUser)) 
  }, [user])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="/callback" element={<GoogleCallback />} />
          <Route path="signup" element={<Signup />} />
          <Route path="problems" element={<Problems />} />
          <Route path="articles" element={<Articles />} />
          <Route path="quizzes" element={<Quizzes />} />
          <Route path="forgot" element={<ForgotPassword />} />
          <Route path="newpost" element={<NewPost />} />
          <Route path="/new/article" element={<SubmitArticle />} />
          <Route path="/new/problem" element={<SubmitProblem />} />
          <Route exact path="/password/:username/:token" element={<PasswordReset />} />
          <Route exact path="/confirmation/:token" element={<Confirmation />} />
          <Route exact path="/problem/:id" element={<Solver />} />
          <Route exact path="/article/:id" element={<Reader />} />
          <Route exact path="/quiz/:id" element={<QuizViewer />} />
          <Route exact path="/solvequiz/:id" element={<QuizSolver />} />
          <Route exact path="/user/:name" element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  )
}

export default Root