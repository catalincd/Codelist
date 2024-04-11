import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Cookies from 'universal-cookie';
import { Link, useSearchParams } from "react-router-dom"
import { UserContext } from "../utils/UserContext";
import { useNavigate } from "react-router-dom"

const PasswordReset = (props) => {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState('')

    const username = searchParams.get("username")
    const token = searchParams.get("token")

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


        fetch(`${process.env.REACT_APP_HOSTNAME}/auth/passwordreset/${token}`,
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
                const cookies = new Cookies()
                cookies.set('username', data.username, { path: '/' })
                cookies.set('email', data.email, { path: '/' })
                cookies.set('token', data.token, { path: '/' })
                cookies.set('picture', data.picture, { path: '/' })
                setUser({ username: data.username, token: data.token, email: data.email, picture: data.picture})
                navigate("/");
            })
            .catch(error => console.error(error));
    }


    return (
        <div className="mainContainer">
            <Layout>
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