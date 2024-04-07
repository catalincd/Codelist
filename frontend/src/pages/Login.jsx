import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Title from 'reactjs-title'
import { UserContext } from "../utils/UserContext";
import Layout from "../components/Layout";
import Cookies from 'universal-cookie';


const Login = (props) => {

  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [errorMessage, setErrorMessage] = useState('')

  const onLogin = (e) => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/auth/login`,
    {
      method: "POST",
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        useroremail: username,
        password: password
      })
    })
    .then(response => response.json())
    .then(data => {
      if(data.error)
      {
        setErrorMessage(data.error)
        return
      } 
      
      const cookies = new Cookies()
      cookies.set('username', data.username, { path: '/' })
      cookies.set('email', data.email, { path: '/' })
      cookies.set('token', data.token, { path: '/' })
      setUser({username: data.username, token: data.token})
      navigate("/");
    })
    .catch(error => console.error(error));
  }

  const onForgot = () => {
    navigate("/forgot");
  }

  return (
    <div className="mainContainer">
      <Layout>
        <div className="tile pageFiller loginContainer">
          <div className={'inputContainer'}>
            <p>Username</p>
            <input
              value={username}
              placeholder="john123"
              onChange={(e) => setUsername(e.target.value)}
              className={'usernameInput'}
            />
          </div>
          <div className={'inputContainer'}>
            <p>Password</p>
            <input
              type="password"
              value={password}
              placeholder="Str0ngPa$$w0rd!#@"
              onChange={(e) => setPassword(e.target.value)}
              className={'passwordInput'}
            />
          </div>
          <div className="formButtonStack">
            <button onClick={() => onForgot()}>Resetare parola</button>
            <button onClick={() => onLogin()}>Login</button>
          </div>
          <p className="errorMessage">{errorMessage}</p>
        </div>
      </Layout>
    </div>
  );
}
export default Login;