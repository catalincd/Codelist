import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import QuizElement from "../components/QuizElement";
import SearchBar from "../components/SearchBar"
import Requests from "../utils/Requests"
import { UserContext } from "../utils/UserContext";

const Quizzes = (props) => {

    document.title = `Codelist - Exams`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [quizList, setQuizList] = useState([]);

    useEffect(() => {
        Requests.FetchItemData("quizzes", setQuizList, setErrorMessage)
    }, [])

    const handleSearch = (query, code, password) => {
        Requests.FetchItemData("quizzes", setQuizList, setErrorMessage, query, code, password)
    }

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <SearchBar onChange={handleSearch} onSearch={handleSearch} hasPassword={true} inputPlaceholder="Caută un articol" />
                <div className="problemsPageContainer">
                    {quizList.map(quiz => <QuizElement key={quiz.id} {...quiz}/>)}
                </div>
            </Layout>
        </div>
    );
}

export default Quizzes;
