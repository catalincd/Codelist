import React, { useContext, useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useParams } from "react-router"
import Layout from "../components/Layout"
import ArticleElement from "../components/ArticleElement"
import Renderer from "../components/Renderer"
import QuizStep from "../components/QuizStep"
import CodeEditor from "../components/CodeEditor"
import ResultElement from "../components/ResultElement"

import Countdown from "react-countdown";


import {
  CircularProgressbar,
  CircularProgressbarWithChildren,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import { UserContext } from "../utils/UserContext"
import Utils from "../utils/Utils"
import Requests from "../utils/Requests"

const QuizSolver = (props) => {

  document.title = `Codelist - Quiz`

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserContext);

  const { id } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [creatorData, setCreatorData] = useState(null)
  const [quizData, setQuizData] = useState(null)
  const [currentStep, setCurrentStep] = useState(null)
  const [completed, setCompleted] = useState([])
  const [scores, setScores] = useState([])
  const [totalScore, setTotalScore] = useState(0)
  const [result, setResult] = useState(null)
  const [targetDate, setTargetDate] = useState(null)
  const isAlive = useRef(true);
  const [percentage, setPercentage] = useState(100)


  useEffect(() => {
    isAlive.current = true
    return () => {
      isAlive.current = false
    }
  }, [])

  const goToResults = () => {
    if (isAlive.current)
      navigate(`/quiz/${id}/results`)
  }

  const fetchUserData = async (username) => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/api/data/user/${username}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => setCreatorData(data))
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/api/quizzes/data`,
      {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
        body: JSON.stringify({
          id
        })
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error)
          setTimeout(() => { navigate(`/quiz/${id}`) }, 3000)
          return
        }
        setQuizData(data)
        setCompleted(data.steps.map(step => step.completed))
        setScores(data.steps.map(step => step.currentScore))
        setCurrentStep(data.steps[0])

        const newTarget = new Date(data.userStartTime)
        newTarget.setMinutes(newTarget.getMinutes() + data.maxTime || 0)
        const finalTarget = data.maxTime ? ((data.endTime && newTarget > data.endTime) ? data.endTime : newTarget) : data.endTime

        const newQuizDictionary = user.quizzes || {}
        const newQuizObj = { userStartTime: data.userStartTime, expires: finalTarget, token: data.token, solutionId: data.solutionId }
        const newQuizArray = user.quizzes ? (user.quizzes[id] ? (user.quizzes[id].filter(q => q.solutionId == data.solutionId).length > 0 ? user.quizzes[id] : [...user.quizzes[id], newQuizObj]) : [newQuizObj]) : [newQuizObj]
        newQuizDictionary[id] = newQuizArray

        //console.log({...user, quizzes: newQuizDictionary})
        setUser({ ...user, quizzes: newQuizDictionary })


        if (data.maxTime) {
          setTargetDate(finalTarget)
          // TO DO setTimeout(onTimeIsUp, ) TO DO
        }

        const dtnow = new Date()
        setTimeout(() => {
          goToResults()
        }, finalTarget.getTime() - dtnow.getTime())
        setInterval(() => setPercentage(new Date().getTime()), 1500);

        document.title = `Codelist - ${data.name}`
        fetchUserData(data.creator)
        console.log(data)
      })
  }, [])

  const getPercentage = () => {
    const dateNow = new Date()
    return quizData ? ((targetDate.getTime() - dateNow.getTime()) / 600) / quizData.maxTime : 100
  }


  const onStepClick = (i) => {
    setResult(null)
    setCurrentStep(quizData.steps[i])

    if (quizData.steps[i].type == "article") {
      const newCompleted = [...completed]
      newCompleted[i] = true
      setCompleted(newCompleted)
    }
  }

  const onSubmitHandle = async (files, language) => {
    setResult("loading")
    Utils.ScrollToRuntime()
    Requests.FetchSubmitQuizProblemRequest(user, files, language, quizData, quizData.steps.indexOf(currentStep), setErrorMessage, setResult)
  }


  const onRunHandle = async (files, language) => {
    setResult("loading")
    Utils.ScrollToRuntime()
    Requests.FetchRunRequest(user, files, language, setErrorMessage, setResult)
  }

  useEffect(() => {
    if (result && result.tests) {
      const newScores = [...scores]
      newScores[result.stepId] = Math.max(newScores[result.stepId], result.score)
      setScores(newScores)

      const newCompleted = [...completed]
      newCompleted[result.stepId] ||= (result.score == currentStep.score)
      setCompleted(newCompleted)

      setTotalScore(newScores.reduce((sum, a) => sum + a, 0))
    }
  }, [result])

  return (
    <div className="mainContainer">
      <Layout error={errorMessage} setError={setErrorMessage}>
        {
          quizData &&
          <div className={"quizSolverContainer"}>
            <div className="topQuiz tile">
              <div className="nameContainer">
                <h3>{quizData.name}</h3>
              </div>
              <div className="stepsContainer">
                {
                  quizData.steps.map((step, i) => <QuizStep key={i} onClickHandle={(e) => onStepClick(i)} active={step == currentStep} complete={completed[i]} {...step} />)
                }
              </div>
              {
                targetDate &&
                <div className="countdownContainer">
                  <p className="pointsContainer">
                    <span className={"done" + (quizData.maxScore == totalScore ? " completed" : "")}>{totalScore}</span>
                    /
                    <span className="total">{quizData.maxScore}</span>
                  </p>
                  <Countdown renderer={Utils.CountdownRenderer} date={targetDate} />
                  <div className="clockContainer">
                    <CircularProgressbar
                      key={percentage}
                      value={getPercentage()}
                      strokeWidth={50}
                      styles={buildStyles({
                        strokeLinecap: "butt", pathColor: "red"
                      })}
                    />
                  </div>
                </div>
              }

            </div>
            <div className={"contentQuiz tile" + ((currentStep.type == "article") ? " isArticle" : "")}>
              <div className="titleContainer">
                <h3>{currentStep.name}</h3>
                {
                  currentStep.type == "problem" &&
                  <p className="pointsContainer">
                    <span className={"done" + (completed[quizData.steps.indexOf(currentStep)] ? " completed" : "")}>{scores[quizData.steps.indexOf(currentStep)]}</span>
                    /
                    <span className="total">{currentStep.score}</span>
                  </p>
                }
              </div>
              <div className="currentItem">
                <Renderer>{currentStep.text}</Renderer>
              </div>
            </div>
            <div id="main-ide" className="ide-full-container">
              {
                currentStep.type == "problem" &&
                <div className="codeEditorContainer tile">
                  <CodeEditor key={quizData.steps.indexOf(currentStep)} enableRun={true} inputFiles={currentStep.files} inputExamples={null} onRun={onRunHandle} onSubmit={onSubmitHandle} codeId={`${id}_${quizData.steps.indexOf(currentStep)}`} />
                </div>
              }
              {
                result &&
                <div id="ide-runtime" className="ide-runtime tile">
                  <div className="ide-runtime-title">
                    <h4>Execuție</h4>
                    {
                      Utils.GetExecutionTimeElement(result, result == "loading")
                    }
                  </div>
                  <div className="ide-runtime-grid">
                    <textarea disabled rows={(result.error ? result.error : result.stdout)?.split('\n').length} value={(result == "loading" ? "Loading..." : (result.error ? result.error : result.stdout)) || ""} />
                  </div>
                </div>
              }
            </div>
            {
              result && result.tests &&
              <div className="ide-solutions tile">
                <div className="ide-title">
                  <h4>Rezultate</h4>
                </div>
                <div id="ide-results" className="resultsTable">
                  <div className="resultsDate">
                    <ResultElement id={0} {...result} />
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </Layout>
    </div>
  )
}


export default QuizSolver