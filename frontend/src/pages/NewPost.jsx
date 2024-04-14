import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import { useNavigate } from "react-router-dom"

import { UserContext } from "../utils/UserContext";

const NewPost = (props) => {

    const { user, setUser } = useContext(UserContext);

    const navigate = useNavigate()

    const handleNewProblem = () => {
        navigate(`/newproblem`)
    }

    const handleNewArticle = () => {
        navigate(`/newarticle`)
    }

    return (
        <div className="mainContainer">
            <Layout>
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