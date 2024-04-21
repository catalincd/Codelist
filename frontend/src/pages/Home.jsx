import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Problem from "../components/Problem";
import ProblemElement from "../components/ProblemElement";

import { UserContext } from "../utils/UserContext";

const Home = (props) => {

    document.title = `Codelist - Home`

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [problemList, setProblemList] = useState([]);

    useEffect(() => {
        const fetchProblemData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/api/problems/homescreen`,
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

    var keyIterator = 0

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="problemsPageContainer">
                    {problemList.map(problem => <ProblemElement {...problem} />)}
                </div>
            </Layout>
        </div>
    );
}
export default Home;