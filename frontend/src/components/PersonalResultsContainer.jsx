import React, { useContext, useState, useEffect } from "react"
import { useParams } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import QuizMiniElement from "../components/QuizMiniElement"
import QuizStep from "../components/QuizStep"
import Renderer from "../components/Renderer"
import IconButton from "../components/IconButton"
import QuizResultElement from "../components/QuizResultElement"
import Utils from "../utils/Utils"


import { UserContext } from "../utils/UserContext"

const PersonalResultsContainer = ({quizData, setErrorMessage}) => {

    const { id } = useParams()

    const navigate = useNavigate()
    const { user, setUser } = useContext(UserContext);
    const [currentScore, setCurrentScore] = useState(null)
    const [currentStep, setCurrentStep] = useState(null)
    const [stepData, setStepData] = useState(null)
    const [solutionsData, setSolutionsData] = useState([])

    useEffect(() => {
        if (!user) return;

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/getQuizSolutions?username=${user.username}&quizId=${id}`,
            {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error)
                    return
                }
                setSolutionsData(data)

            })
            .catch(error => console.error(error))
    }, [])

    useEffect(() => {
        if (solutionsData && quizData) onStepClick(0)
    }, [solutionsData, quizData])

    const onStepClick = (i) => {
        setCurrentStep(i)
        const found = solutionsData.find(x => (x._id == user.quizzes[id][i].solutionId))
        if (!found) return
        setCurrentScore(found.score)
        const mappedData = quizData.steps.map((step, i) => {
            return step.type == "problem" ? {
                ...found.steps[i],
                stepName: step.name,
                maxScore: step.score,
                createdAt: found.createdAt
            } : null
        })
        setStepData(mappedData)
    }

    return (
        <div className="resultsContent tile resultsPageFiller">
              <div className="resultsTop">
                <h3 className="resultsTitle">
                  Rezultate personale
                </h3>
                <div className="triesContainer">
                  {
                    user.quizzes[id].map((step, i) => <QuizStep key={i} onClickHandle={(e) => onStepClick(i)} active={i == currentStep} complete={false} type={i + 1} />)
                  }
                </div>
                <div className="pointsContainer">
                  {
                      quizData && stepData &&
                      <p><span>{currentScore}</span>/<span>{quizData.maxScore}</span></p>
                  }
                </div>
              </div>
              {
                quizData && stepData &&
                <div className="resultsTableContainer">
                  <div className="resultsTable">
                    {
                      stepData.filter(step => step != null).map((step, i) => <QuizResultElement key={i} {...step} />) //
                    }
                  </div>
                </div>
              }
            </div>)
}

export default PersonalResultsContainer