import React, { useContext, useState, useEffect } from "react"
import Title from 'reactjs-title'
import { UserContext } from "../utils/UserContext";
import Layout from "../components/Layout";



const Signup = (props) => {

  const { user, setUser } = useContext(UserContext);


  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [success, setSuccess] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const onSignup = (e) => {
    if (username.length < 4 || password.length < 4 || confirmPassword.length < 4) {
      setErrorMessage("Please complete all fields")
      return
    }

    if (password != confirmPassword) {
      setErrorMessage("Passwords don't match")
      return
    }


    fetch(`${process.env.REACT_APP_HOSTNAME}/auth/register`,
      {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error)
          return
        }
        
        setSuccess(data.message == "USER_REGISTER_SUCCESS")
      })
      .catch(error => console.error(error));
  }

  return (
    <div className="mainContainer">
      <Layout>
        { !success &&
          <div className="tile pageFiller loginContainer">
            <div className={'inputContainer'}>
              <p>Email</p>
              <input
                value={email}
                placeholder="john.doe@esa.int"
                onChange={(e) => setEmail(e.target.value)}
                className={'emailInput'}
              />
            </div>
            <div className={'inputContainer'}>
              <p>Username</p>
              <input
                value={username}
                placeholder="john123"
                onChange={(e) => setUsername(e.target.value.replace(/[^A-Za-z0-9\-_]/g, ''))} //disable . for .. vulnerability
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
            <div className={'inputContainer'}>
              <p>Repeat</p>
              <input
                type="password"
                value={confirmPassword}
                placeholder="Str0ngPa$$w0rd!#@"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={'passwordInput'}
              />
            </div>
            <button onClick={() => onSignup()}>Sign up</button>
            <p className="errorMessage">{errorMessage}</p>
          </div>
        }
        {
          success &&
          <div className="tile pageFiller loginContainer">
              <p>Un email cu link-ul de activare a fost trimis la {email}!</p>
              <p>Nu uita să verifici și folderul 'Spam'.</p>
          </div>
        }
      </Layout>
    </div>
  );
}
export default Signup;