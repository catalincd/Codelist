import React, { useState, useEffect, useContext, useRef } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import Renderer from "../components/Renderer"

import Layout from "../components/Layout";
import Example from "../components/Example";
import ProblemElement from "../components/ProblemElement"
import ResultContainer from "../components/ResultContainer"


import { UserContext } from "../utils/UserContext";

import CodeEditor from "../components/CodeEditor"

import Utils from "../utils/Utils"

const Solver = (props) => {

  const { user, setUser } = useContext(UserContext);

  const { id } = useParams()

  const [showLoadingResult, setShowLoadingResult] = useState(false)
  const [showLoadingRuntime, setShowLoadingRuntime] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [problemData, setProblemData] = useState(null)
  const [creatorData, setCreatorData] = useState(null)
  const [results, setResults] = useState([])
  const [runtime, setRuntime] = useState(null)

  

  const scrollToLastResult = () => {
    const resultsElement = document.getElementById("ide-results") // TO DO Fix dis
    if (resultsElement)
      resultsElement.scrollIntoView({ behavior: 'smooth', block: "end" });
    else
      setTimeout(scrollToLastResult, 50)
  }

  const onSubmitHandle = async (files, language) => {
    setRuntime({ loading: true })
    setShowLoadingRuntime(true)
    setShowLoadingResult(true)
    Utils.ScrollToRuntime()

    try {
      const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/send`,
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
          body: JSON.stringify({
            problemId: id,
            username: user.username,
            source: [...files],
            language
          })
        })

      if (!response.ok) {
        setErrorMessage("ERROR REQ FAILED")
        return
      }

      const data = await response.json()
      console.log(data)
      setResults([...results, data])
      setRuntime(data)
    }
    catch (error) {
      setErrorMessage(error)
    }
    finally {
      setShowLoadingResult(false)
      setShowLoadingRuntime(false)
      scrollToLastResult()
    }
  }

  const onRunHandle = async (files, language) => {
    setShowLoadingRuntime(true)
    setRuntime({ loading: true })
    Utils.ScrollToRuntime()
    console.log(files)

    try {
      const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/run`,
        {
          method: "PUT",
          headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
          body: JSON.stringify({
            username: user.username,
            source: [...files],
            language
          })
        })

      if (!response.ok) {
        setErrorMessage("ERROR REQ FAILED")
        return
      }

      const data = await response.json()
      console.log(data)
      setRuntime(data)
      //setResults([...results, data])
      //set runtime output here
    }
    catch (error) {
      setErrorMessage(error)
    }
    finally {
      setShowLoadingRuntime(false)
    }
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
    const fetchProblemData = async () => {
      fetch(`${process.env.REACT_APP_HOSTNAME}/api/problems/?id=${id}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setErrorMessage(data.error)
            return
          }
          setProblemData(data)
          document.title = `Codelist - ${data.name}`
          fetchUserData(data.creator)
          console.log(data)
        })
        .catch(error => console.error(error));
    }

    fetchProblemData()
  }, [])



  useEffect(() => {
    if (!user)
      return

    const fetchProblemData = async () => {
      fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/getUserSolutions?username=${user.username}`,
        {
          method: "GET"
        })
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            setErrorMessage(data.error)
            return
          }
          setResults(data)
          console.log(data)
        })
        .catch(error => console.error(error));
    }

    fetchProblemData()
  }, [])

  const examples = problemData?.examples

  return (
    <div className="mainContainer">
      <Layout error={errorMessage} setError={setErrorMessage}>
        <div className="solverContainer">
          <ProblemElement id={id} {...problemData} disableLink={true} />
          {
            problemData &&
            <div className="problemContentContainer tile">
              <div className="top-bar">
                <div className="example-name">
                  <h4>Descriere</h4>
                </div>
              </div>
              <div className="markdown">
                <Renderer>{problemData.text}</Renderer>
              </div>
            </div>
          }
          <div className="ide-examples-container tile">
            <div className="top-bar">
              <div className="example-name">
                <h4>Exemple</h4>
              </div>
            </div>
            <div className="ide-examples">
              {
                examples?.map((example) => <Example key={example.inputValue} {...example} {...problemData.files} />)
              }
            </div>
          </div>
          <div className="ide-textarea tile">
            {
              problemData &&
              <CodeEditor enableRun={user != null} inputFiles={problemData.files} inputExamples={problemData.examples} onRun={onRunHandle} onSubmit={onSubmitHandle} codeId={id} />
            }
          </div>
          {(runtime || showLoadingRuntime) &&
            <div id="ide-runtime" className="ide-runtime tile">
              <div className="ide-runtime-title">
                <h4>Execuție</h4>
                {Utils.GetExecutionTimeElement(runtime, showLoadingRuntime)}
              </div>
              {showLoadingRuntime &&
                <div className="ide-runtime-grid">
                  <textarea disabled rows={1} value="Loading..." />
                </div>
              }
              {!showLoadingRuntime &&
                <div className="ide-runtime-grid">
                  <textarea disabled rows={(runtime.error ? runtime.error : runtime.stdout)?.split('\n').length} value={(runtime.error ? runtime.error : runtime.stdout) || ""} />
                </div>
              }
            </div>
          }
          {user && results.length > 0 &&
            <div className="ide-solutions tile">
              <div className="ide-title">
                <h4>Rezultate</h4>
              </div>
              <ResultContainer results={results}/>
            </div>
          }
          {!user &&
            <div className="ide-solutions tile">
              <div className="ide-content">
                <h4>Intră în cont pentru a putea trimite soluții pentru probleme</h4>
                <Link className="login" to="/login">Log in</Link>
                <Link className="signup" to="/signup">Sign up</Link>
              </div>
            </div>
          }
          {
            problemData &&
            <div className="problemDetailsContainer tile">
              <div className="top-bar">
                <div className="example-name">
                  <h4>Detalii</h4>
                </div>
              </div>
              <div className="detailsTable">
                <div className="creator">
                  <p>Creator: </p>
                  <div className="creatorImg">
                    <Link to={`/user/${problemData?.creator}`}>
                      <p>{problemData.creator}</p>
                      <img src={Utils.GetUserPicture(creatorData)} />
                    </Link>
                  </div>
                </div>
                <div className="limits">
                  <div className="time">
                    <p>Limită de timp: {"1.0s"}</p>
                  </div>
                  <div className="mem">
                    <p>Limită de memorie: {"100MB"}</p>
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </Layout>
    </div>
  );
}


export default Solver;