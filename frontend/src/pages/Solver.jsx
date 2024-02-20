import React, { useState, useEffect, useContext } from "react"
import { useSearchParams } from "react-router-dom"

import Layout from "../components/Layout";
import ProblemElement from "../components/ProblemElement";

import { UserContext } from "../utils/UserContext";

const Solver = (props) => {

  const { user, setUser } = useContext(UserContext);

  const [searchParams, setSearchParams] = useSearchParams();
  const id = searchParams.get("id")

  const [showLoadingResult, setShowLoadingResult] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [problemData, setProblemData] = useState(null)
  const [results, setResults] = useState([])

  const [code, setCode] = useState('');

  const checkSolution = async () => {
    setShowLoadingResult(true)

    try {
      const response = await fetch('http://localhost:8080/solutions/send',
        {
          method: "POST",
          headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
          body: JSON.stringify({
            problemId: id,
            username: user.username,
            code: code
          })
        })

        if(!response.ok)
        {
          setErrorMessage("ERROR REQ FAILED")
          return
        }
        
        const data = await response.json()
        console.log(data)
        setResults([...results, data])
    }
    catch (error) {
      setErrorMessage(error)
    }
    finally {
      setShowLoadingResult(false)
    }
  }

  useEffect(() => {
    const fetchProblemData = async () => {
      fetch(`http://localhost:8080/problems/details?id=${id}`,
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
      fetch(`http://localhost:8080/solutions/getUserSolutions?username=${user.username}`,
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
      <Layout>
        <div className="solverContainer">
          <ProblemElement id={id} data={problemData} cancelFetch={true} />
          <div className="ide-examples-container tile">
            <div className="top-bar">
              <div className="example-name">
                <h4>Exemple</h4>
              </div>
            </div>
            <div className="ide-examples">
              {
                examples?.map((example) => <Example key={example.inputValue} data={example} />)
              }
            </div>
          </div>
          <div className="ide-textarea tile">
            <div className="ide-title">
              <h4>Soluție</h4>
            </div>
            <div className="ide-controls">
              <button className="language">C++</button>
              <p></p>
              <button className="submit" onClick={() => checkSolution()}>Submit</button>
            </div>
            <textarea spellCheck="false" className="" value={code} onChange={e => setCode(e.target.value)} rows="30" />
          </div>
          <div className="ide-solutions tile">
            <div className="ide-title">
              <h4>Rezultate</h4>
            </div>
            <div className="resultsTable">
              {GetResultElements(results).reverse()}
              {showLoadingResult && GetLoadingResultElement(results)}
            </div>
          </div>
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

const Example = (props) => {
  return (
    <div className="ide-example">
      <div className="ide-example-tab ide-example-input">
        <h5>{props.data.inputName}</h5>
        <p>{props.data.inputValue}</p>
      </div>
      <div className="ide-example-tab  ide-example-output">
        <h5>{props.data.outputName}</h5>
        <p>{props.data.outputValue}</p>
      </div>
    </div>
  )
}

export default Solver;