import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom"

import { UserContext } from "../utils/UserContext";

const NewPost = (props) => {

    document.title = `Codelist - Postare nouă`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')

    const navigate = useNavigate()

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="tile newPostContainer pageFiller">
                    <h3>Postare nouă</h3>
                    <div className="newPostButtonsContainer">
                        <button onClick={() => navigate(`/new/problem`)}>Problemă nouă</button>
                        <button onClick={() => navigate(`/new/article`)}>Articol nou</button>
                        <button onClick={() => navigate(`/new/quiz`)}>Curs nou</button>
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default NewPost;