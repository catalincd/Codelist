import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import QuizElement from "../components/QuizElement";

import { UserContext } from "../utils/UserContext";

const Courses = (props) => {

    document.title = `Codelist - Cursuri`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [problemList, setProblemList] = useState([]);

    useEffect(() => {
        const fetchProblemData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/api/quizzes/homescreen`,
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
                    setProblemList(data)
                    console.log(data)
                })
                .catch(error => console.error(error));

            console.log("FETCHED FROM PROBLEM")
        }

        fetchProblemData()
    }, [])

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="problemsPageContainer">
                    {problemList.map(problem => <QuizElement key={problem.id} {...problem}/>)}
                </div>
            </Layout>
        </div>
    );
}

export default Courses;