import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Article from "../components/Article";

import { UserContext } from "../utils/UserContext";

const Articles = (props) => {

    document.title = "Codelist - Articole"

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [articlesList, setArticlesList] = useState([]);

    useEffect(() => {
        const fetchProblemData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/api/articles/homescreen`,
                {
                    method: "GET"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                        setErrorMessage(data.error)
                        return
                    }
                    setArticlesList(data)
                    console.log(data)
                })
                .catch(error => console.error(error));

            console.log("FETCHED ARTICLES")
        }

        fetchProblemData()
    }, [])

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="problemsPageContainer">
                    {articlesList.map(problem => <Article key={problem.id} {...problem} />)}
                </div>
            </Layout>
        </div>
    );
}

export default Articles;