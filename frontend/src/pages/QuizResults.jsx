import React, { useContext, useState, useEffect } from "react"
import { useParams } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import QuizMiniElement from "../components/QuizMiniElement"
import PersonalResultsContainer from "../components/PersonalResultsContainer"
import FullResultsContainer from "../components/FullResultsContainer"


import { UserContext } from "../utils/UserContext"

const QuizResults = (props) => {

  document.title = `Codelist - Quiz`

  const { user, setUser } = useContext(UserContext);

  const { id } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [quizData, setQuizData] = useState(null)
  const [quizResultData, setQuizResultData] = useState(null)


  const navigate = useNavigate()


  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.REACT_APP_HOSTNAME}/api/quizzes?id=${id}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error)
          return
        }
        setQuizData(data)
        document.title = `Rezultate - ${data.name}`
      })
  }, [])

  useEffect(() => {
    if (!user) return;

    fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/getQuizResults?quizId=${id}`,
        {
            method: "GET"
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                setErrorMessage(data.error)
                return
            }
            console.log(data)
            setQuizResultData(data)

        })
        .catch(error => console.error(error))
}, [])


  return (
    <div className="mainContainer">
      <Layout error={errorMessage} setError={setErrorMessage}>
        <div className="problemsPageContainer">
          {
            quizData &&
            <QuizMiniElement {...quizData} />
          }
          {
            quizData && user.quizzes && user.quizzes[id] &&
            <PersonalResultsContainer quizId={id} quizData={quizData} setErrorMessage={setErrorMessage}/>
          }
                    {
            quizData && quizResultData && quizResultData.length > 0 && 
            <FullResultsContainer quizId={id} quizData={quizData} resultsData={quizResultData} setErrorMessage={setErrorMessage}/>
          }
        </div>
      </Layout>
    </div>
  )
}


export default QuizResults