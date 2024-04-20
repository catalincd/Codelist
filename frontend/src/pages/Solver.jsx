import React, { useState, useEffect, useContext, useRef } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import ReactMarkdown from "react-markdown"

import Layout from "../components/Layout";
import Example from "../components/Example";
import ProblemElement from "../components/ProblemElement"


import { UserContext } from "../utils/UserContext";

import CodeEditor from "../components/CodeEditor"

import { BiErrorCircle } from "react-icons/bi";
import { BsMemory } from "react-icons/bs";
import { BsCpu } from "react-icons/bs";


import { GetLanguageExtension } from "../utils/Code"

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

  const runtimeRef = useRef(null)


  const scrollToRuntime = () => {
    const runtimeElement = document.getElementById("ide-runtime")
    if (runtimeElement)
      runtimeElement.scrollIntoView({ behavior: 'smooth', block: "center" });
    else
      setTimeout(scrollToRuntime, 50)
  }

  const scrollToLastResult = () => {
    const resultsElement = document.getElementById("ide-results")
    if (resultsElement)
      resultsElement.scrollIntoView({ behavior: 'smooth', block: "end" });
    else
      setTimeout(scrollToLastResult, 50)
  }

  const onSubmitHandle = async (code, language) => {
    setRuntime({ loading: true })
    setShowLoadingRuntime(true)
    setShowLoadingResult(true)
    scrollToRuntime()

    try {
      const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/send`,
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
          body: JSON.stringify({
            problemId: id,
            username: user.username,
            code: code,
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

  const onRunHandle = async (code, language) => {
    setShowLoadingRuntime(true)
    setRuntime({ loading: true })
    scrollToRuntime()

    try {
      const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/run`,
        {
          method: "PUT",
          headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
          body: JSON.stringify({
            username: user.username,
            source: [
              {name: `Main.${GetLanguageExtension[language]}`, code}
            ],
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
                <ReactMarkdown>{problemData.text}</ReactMarkdown>
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
            <CodeEditor enableRun={user != null} onRun={onRunHandle} onSubmit={onSubmitHandle} codeId={id} />
          </div>
          {(runtime || showLoadingRuntime) &&
            <div id="ide-runtime" className="ide-runtime tile">
              <div className="ide-runtime-title">
                <h4>Execuție</h4>
                {GetExecutionTimeElement(runtime, showLoadingRuntime)}
              </div>
              {showLoadingRuntime &&
                <div className="ide-runtime-grid">
                  <textarea disabled rows={1} value="Loading..." />
                </div>
              }
              {!showLoadingRuntime &&
                <div className="ide-runtime-grid">
                  <textarea disabled rows={(runtime.error? runtime.error:runtime.stdout).split('\n').length} value={runtime.error? runtime.error : runtime.stdout} />
                </div>
              }
            </div>
          }
          {user && results.length > 0 &&
            <div className="ide-solutions tile">
              <div className="ide-title">
                <h4>Rezultate</h4>
              </div>
              <div id="ide-results" className="resultsTable">
                {GetResultElements(results)}
                {showLoadingResult && GetLoadingResultElement(results)}
              </div>
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
                      <img src={`${process.env.REACT_APP_HOSTNAME}/images/${creatorData && creatorData.picture || "default.png"}`} />
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

const GetProgressBar = (tests, message = null) => {
  const passed = tests.filter(test => test).length
  const ratio = parseInt(100 * parseFloat(passed) / parseFloat(tests.length))
  const widthString = `${ratio}%`

  return (
    <div className="progress-bar-container">
      <div className="progress-bar" style={{ width: widthString }}></div>
      {message ? <p>{message}</p> : <p>{ratio}% ({passed}/{tests.length})</p>}
    </div>
  )
}

const GetMemString = (mem) => {
  var units = ["B", "KB", "MB", "GB"]
  var unitId = 0

  while (mem > 1000) {
    unitId++
    mem /= 1000
  }

  return `${mem.toFixed(1)}${units[unitId]}`
}

const GetExecutionTimeElement = (runtime, loading) => {
  if (loading) return (<div></div>)

  if (runtime.error)
    return (
      <div className="diagnostic-error">
        <h4>Error</h4>
        <BiErrorCircle />
      </div>
    )

  return (
    <div className="diagnostic-success">
      <div className="diagnostic-sub cpu">
        <BsCpu />
        <h4>{`${parseFloat(runtime.time).toFixed(1)}s`}</h4>
      </div>
      <div className="diagnostic-sub memory">
        <BsMemory />
        <h4>{GetMemString(parseFloat(runtime.memory))}</h4>
      </div>
    </div>
  )
}

const GetLoadingResultElement = (results) => {
  return (<div key={99} className="resultRow">
    <h4>{results.length + 1}</h4>
    {GetProgressBar([], "Loading...")}
  </div>)
}

const GetResultElements = (results, showLoadingResult) => {
  let keyIterator = 1

  return results.map(result =>
    <div key={keyIterator++} className="resultRow">
      <h4>{keyIterator}</h4>
      {GetProgressBar(result.tests)}
    </div>)
}

export default Solver;