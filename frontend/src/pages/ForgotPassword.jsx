import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Title from 'reactjs-title'
import { UserContext } from "../utils/UserContext";
import Layout from "../components/Layout";


const ForgotPassword = (props) => {

    document.title = `Codelist - Recuperare parola`

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)

    const onReset = (e) => {
        if (email.length < 4) {
            setErrorMessage("Please complete all fields")
            return
        }

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/sendpasswordreset`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token }
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error)
                    return
                }

                setSuccess(data.message == "PASSWORD_RESET_SENT_SUCCESS")
            })
            .catch(error => console.error(error));
    }


    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                {
                    !success &&
                    <div className="tile pageFiller loginContainer">
                        <div className={'inputContainer'}>
                            <p>Email</p>
                            <input
                                value={email}
                                placeholder="john.doe@esa.int"
                                onChange={(e) => setEmail(e.target.value)}
                                className={'usernameInput'}
                            />
                        </div>
                        <button onClick={() => onReset()}>Resetare</button>
                        <p className="errorMessage">{errorMessage}</p>
                    </div>

                }
                {
                    success &&
                    <div className="tile pageFiller loginContainer">
                        <p>Un email cu link-ul de resetare al parolei a fost trimis la {email}!</p>
                        <p>Nu uita să verifici și folderul 'Spam'.</p>
                    </div>
                }
            </Layout>
        </div>
    );
}
export default ForgotPassword;