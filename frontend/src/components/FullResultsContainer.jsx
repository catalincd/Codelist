import React from "react"
import TextButton from './TextButton'

import { useNavigate } from "react-router-dom"

const FullResultsContainer = ({ quizData, resultsData, setErrorMessage }) => {

    const navigate = useNavigate()

    const handleAPI = () => {
        navigate(`/api-docs/`)
    }

    const problemSteps = quizData.steps.map((step, i) => {return {type: step.type, index: i}}).filter((step) => step.type == "problem").map((step) => step.index)


    return (<div className="fullResults tile">
        <div className="resultsTop">
            <h3>Rezultate</h3>
        </div>
        <div className="resultsContainer">
            <div className="tableContainer">
                <div className="tableRow">
                    <p className="first">Utilizator</p>
                    <div className="points">
                    {
                       quizData.steps.filter((step, i) => (problemSteps.includes(i))).map((step, i) => <p key={i}>{step.name}</p>)
                    }
                    </div>
                    <p className="last">Total</p>
                </div>
                {
                    resultsData.map((user, i) => <div key={i}className="tableRow">
                        <p className="first">{user.username}</p>
                        <div className="points">
                        {
                            user.steps.filter((step, i) => (problemSteps.includes(i))).map((step, t) => <p key={t}>{step.score}</p>)
                        }
                        </div>
                        <p className="last">{user.score}</p>
                    </div>)
                }
            </div>
        </div>
    </div>)
}

export default FullResultsContainer