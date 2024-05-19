import React, { useContext, useState, useEffect } from "react"
import { useSearchParams, useNavigate} from "react-router-dom";
import Requests from "../utils/Requests";
import { UserContext } from "../utils/UserContext";
import Layout from "../components/Layout";

const GoogleCallback = (props) => {

    document.title = `Codelist - Login`
    const [searchParams, setSearchParams] = useSearchParams();
    const [errorMessage, setErrorMessage] = useState("")
    const code = searchParams.get("code")

    

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();

    const setData = (data) => {
        setUser(data)
        navigate("/")
    }

    Requests.FetchDataPost({ code }, setData, setErrorMessage) // TO DO Add Hook

    return (<div className="mainContainer">
        <Layout error={errorMessage} setError={setErrorMessage}>
            
        </Layout>
    </div>)
}

export default GoogleCallback