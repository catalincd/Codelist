import React, { useContext, useState, useEffect } from "react"
import { useParams } from "react-router"
import { Link, useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import QuizElement from "../components/QuizElement"
import Renderer from "../components/Renderer"
import IconButton from "../components/IconButton"
import Utils from "../utils/Utils"

import { UserContext } from "../utils/UserContext"

const QuizViewer = (props) => {

  document.title = `Codelist - Quiz`

  const { user, setUser } = useContext(UserContext);

  const { id } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [creatorData, setCreatorData] = useState(null)
  const [quizData, setQuizData] = useState(null)
  const [currentTries, setCurrentTries] = useState(0)

  const navigate = useNavigate()

  const fetchUserData = async (username) => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/api/data/user/${username}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => setCreatorData(data))
  }

  useEffect(() => {
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
        document.title = `Codelist - ${data.name}`
        fetchUserData(data.creator)
        console.log(data)

        setCurrentTries(user? (user.quizzes? (user.quizzes[id]? user.quizzes[id].length : 0) : 0) : null)
      })
  }, [])



  return (
    <div className="mainContainer">
      <Layout error={errorMessage} setError={setErrorMessage}>
        <div className="problemsPageContainer">
          {
            quizData &&
            <QuizElement {...quizData} />
          }
          {
            quizData &&
            <div className="quizDetailsContainer tile">
              <div className="introData markdown">
                <Renderer>{quizData.intro}</Renderer>
              </div>
            </div>
          }
          {
            quizData &&
            <div className="quizStartContainer tile">
              <div className="stepDetails">
                <p>100 puncte</p>
                <p>30 min</p>
              </div>
              <div className="startButtonContainer">
                {
                  user &&
                  <p><span className={quizData.maxTries && quizData.maxTries == currentTries? "out" : ""}>{currentTries}</span>/<span>{quizData.maxTries}</span> Încercări</p>
                }
                
                <IconButton text="START" icon="run" reverse={true} onClickHandle={() => navigate(`/solvequiz/${id}`)}/>
              </div>
            </div>  
          }
          {
            quizData &&
            <div className="problemDetailsContainer tile">
              <div className="top-bar">
                <div className="example-name">
                  <h4>Detalii</h4>
                </div>
              </div>
              
              <div className="quizDetails">
                  <div className="dateDetails">
                    <p>Începe</p>
                    <p>{quizData.startTime && Utils.StringToDateTime(quizData.startTime)}</p>
                    <p>Se termină</p>
                    <p>{quizData.startTime && Utils.StringToDateTime(quizData.endTime)}</p>
                  </div>
                </div>

                <div className="detailsTable">
                <div className="creator">
                  <p>Creator: </p>
                  <div className="creatorImg">
                    <Link to={`/user/${quizData?.creator}`}>
                      <p>{quizData?.creator}</p>
                      <img src={Utils.GetUserPicture(creatorData)} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </Layout>
    </div>
  )
}


export default QuizViewer