import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Cookies from 'universal-cookie';
import { Link, useSearchParams } from "react-router-dom"
import { UserContext } from "../utils/UserContext";
import { useNavigate } from "react-router-dom"

const Confirmation = (props) => {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token")

    useEffect(() => {
        const sendConfirmationData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/auth/confirmation/${token}`,
                {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
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
                    cookies.set('email', data.username, { path: '/' })
                    cookies.set('token', data.token, { path: '/' })
                    setUser({ username: data.username, token: data.token })
                    navigate("/");
                })
                .catch(error => console.error(error));
        }

        sendConfirmationData()
    }, [])


    return (
        <div className="mainContainer">
            <Layout>
            </Layout>
        </div>
    );
}
export default Confirmation;