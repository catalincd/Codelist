import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import { UserContext } from "../utils/UserContext";
import { useNavigate } from "react-router-dom"
import Requests from "../utils/Requests"
import Cookies from 'universal-cookie'

const PasswordReset = (props) => {

    document.title = `Codelist - Resetare parola`

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('')
    const cookies = new Cookies(null, { path: '/', sameSite: "strict", expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // one week later

    const { username, token } = useParams()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const onReset = (e) => {
        if (password.length < 4 || confirmPassword.length < 4) {
            setErrorMessage("Please complete all fields")
            return
        }

        if (password != confirmPassword) {
            setErrorMessage("Passwords don't match")
            return
        }


        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/passwordreset/${token}`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    password: password
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error)
                    return
                }

                console.log(data)
                //cookies.set("USER_COOKIE", JSON.stringify(data))
                setUser(data)
                navigate("/");
            })
            .catch(error => console.error(error));
    }


    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="tile pageFiller loginContainer">
                    <p>Resetare parola utilizator {username}</p>
                    <div className={'inputContainer'}>
                        <p>Parola noua</p>
                        <input
                            type="password"
                            value={password}
                            placeholder="john123"
                            onChange={(e) => setPassword(e.target.value)}
                            className={'usernameInput'}
                        />
                    </div>
                    <div className={'inputContainer'}>
                        <p>Repetă</p>
                        <input
                            type="password"
                            value={confirmPassword}
                            placeholder="Str0ngPa$$w0rd!#@"
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={'passwordInput'}
                        />
                    </div>
                    <button onClick={() => onReset()}>Reset</button>
                    <p className="errorMessage">{errorMessage}</p>
                </div>
            </Layout>
        </div>
    );
}
export default PasswordReset;