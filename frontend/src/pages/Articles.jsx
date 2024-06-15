import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout"
import Article from "../components/Article"
import SearchBar from "../components/SearchBar"
import Requests from "../utils/Requests"
import { UserContext } from "../utils/UserContext"
import ArticleElement from "../components/ArticleElement"

const Articles = (props) => {

    document.title = "Codelist - Articole"

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [articlesList, setArticlesList] = useState([]);

    useEffect(() => {
        Requests.FetchItemData("articles", setArticlesList, setErrorMessage)
    }, [])

    const handleSearch = (query, code, password) => {
        Requests.FetchItemData("articles", setArticlesList, setErrorMessage, query, code)
    }

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <SearchBar onChange={handleSearch} onSearch={handleSearch} inputPlaceholder="Caută un articol" />
                <div className="problemsPageContainer">
                    {articlesList.map(problem => <ArticleElement key={problem.id} {...problem} />)}
                </div>
            </Layout>
        </div>
    );
}

export default Articles;