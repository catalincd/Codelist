import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Problem from "../components/Problem";
import ProblemElement from "../components/ProblemElement";
import Requests from "../utils/Requests"
import SearchBar from "../components/SearchBar"
import { UserContext } from "../utils/UserContext";

const Problems = (props) => {

    document.title = `Codelist - Probleme`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [problemList, setProblemList] = useState([]);

    useEffect(() => {
        Requests.FetchItemData("problems", setProblemList, setErrorMessage)
    }, [])

    const handleSearch = (query, code, password) => {
        Requests.FetchItemData("problems", setProblemList, setErrorMessage, query, code)
    }

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <SearchBar onChange={handleSearch} onSearch={handleSearch} inputPlaceholder="Caută o problemă" />
                <div className="problemsPageContainer">
                    {problemList.map(problem => <ProblemElement key={problem.id} {...problem}/>)}
                </div>
            </Layout>
        </div>
    );
}

export default Problems;