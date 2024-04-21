import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom"

import { UserContext } from "../utils/UserContext";

const NewPost = (props) => {

    document.title = `Codelist - Postare nouă`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    const handleNewProblem = () => {
        navigate(`/new/problem`)
    }

    const handleNewArticle = () => {
        navigate(`/new/article`)
    }

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="tile newPostContainer pageFiller">
                    <h3>Postare nouă</h3>
                    <div className="newPostButtonsContainer">
                        <button onClick={handleNewProblem}>Problemă nouă</button>
                        <button onClick={handleNewArticle}>Articol nou</button>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default NewPost;