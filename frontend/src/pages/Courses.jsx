import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import QuizElement from "../components/QuizElement";
import SearchBar from "../components/SearchBar"
import Requests from "../utils/Requests"
import { UserContext } from "../utils/UserContext";

const Courses = (props) => {

    document.title = `Codelist - Cursuri`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [courseList, setCourseList] = useState([]);

    useEffect(() => {
        Requests.FetchItemData("courses", setCourseList, setErrorMessage)
    }, [])

    const handleSearch = (query, code, password) => {
        Requests.FetchItemData("courses", setCourseList, setErrorMessage, query, code)
    }

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <SearchBar onChange={handleSearch} onSearch={handleSearch} inputPlaceholder="Caută un articol" />
                <div className="problemsPageContainer">
                    {
                        courseList.map(course => <QuizElement key={course.id} {...course} />)
                    }
                </div>
            </Layout>
        </div>
    );
}

export default Courses;