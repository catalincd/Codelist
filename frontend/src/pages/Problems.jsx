import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Problem from "../components/Problem";
import ProblemElement from "../components/ProblemElement";

import { UserContext } from "../utils/UserContext";

const Problems = (props) => {

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [problemList, setProblemList] = useState([]);

    useEffect(() => {
        const fetchProblemData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/problems/homescreen`,
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
            <Layout>
                <div className="problemsPageContainer">
                    {problemList.map(problem => <Problem id={problem.id}/>)}
                </div>
            </Layout>
        </div>
    );
}

export default Problems;