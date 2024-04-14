import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import { Link, useSearchParams } from "react-router-dom"
import { UserContext } from "../utils/UserContext";
import { useNavigate } from "react-router-dom"
import Requests from "../utils/Requests"
import Cookies from 'universal-cookie'

const Confirmation = (props) => {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const token = searchParams.get("token")
    const cookies = new Cookies(null, { path: '/', sameSite: "strict", expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // one week later

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

                    //cookies.set("USER_COOKIE", JSON.stringify(data))
                    setUser(data)
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