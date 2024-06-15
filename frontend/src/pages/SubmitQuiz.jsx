import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import DateTimePicker from 'react-datetime-picker';

import Layout from "../components/Layout"
import LabelSwitch from "../components/LabelSwitch"
import IconButton from "../components/IconButton"
import ArticleElement from "../components/ArticleElement"
import ReactMarkdown from 'react-markdown'
import DataInput from "../components/DataInput"

import CodeMirror from '@uiw/react-codemirror';
import { UserContext } from "../utils/UserContext"

import Renderer from "../components/Renderer"
import QuizElement from "../components/QuizElement"
import QuizStep from "../components/QuizStep"

import 'react-datetime-picker/dist/DateTimePicker.css';

const SubmitQuiz = (props) => {

    const { user, setUser } = useContext(UserContext)

    // TO DO - PARSE STATES FROM STRING

    // ENV
    const [preview, setPreview] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [uploading, setUploading] = useState(false)

    // PARAMS
    const [name, setName] = useState('')
    const [previewText, setPreviewText] = useState('')
    const [password, setPassword] = useState(null)
    const [passwordEnabled, setPasswordEnabled] = useState(false)
    const [publicResults, setPublicResults] = useState(true)

    // DATES
    const [startTimeEnabled, setStartTimeEnabled] = useState(true)
    const [startTime, setStartTime] = useState(new Date())

    const [endTimeEnabled, setEndTimeEnabled] = useState(true)
    const [endTime, setEndTime] = useState(new Date().setMinutes(new Date().getMinutes() + 20))

    // NUMBERS
    const [maxTimeEnabled, setMaxTimeEnabled] = useState(true)
    const [maxTime, setMaxTime] = useState(120)

    const [maxTries, setMaxTries] = useState(3)

    // STEPS
    const [currentType, setCurrentType] = useState("article")
    const [currentStep, setCurrentStep] = useState(0)
    const [stepCounter, setStepCounter] = useState(0)
    const [steps, setSteps] = useState([])
    const [stepName, setStepName] = useState("")
    const [stepText, setStepText] = useState("")
    const [stepScore, setStepScore] = useState(20)

    // PROBLEMS
    const [exampleId, setExampleId] = useState(0)
    const [examples, setExamples] = useState([{ id: 0, inputValue: "", outputValue: "" }])

    const [testId, setTestId] = useState(0)
    const [tests, setTests] = useState([{ id: 0, inputValue: "", outputValue: "" }])

    const [{ stdin, stdout }, setStreamTypes] = useState({ stdin: false, stdout: false })
    const [{ inputName, outputName }, setFileTypes] = useState({ inputName: "input.txt", outputName: "output.txt" })


    const navigate = useNavigate()

    const onUpload = async () => {
        if (name == "" || previewText == "" || !checkTestsAndExamples()) {
            setErrorMessage("Completați toate câmpurile")
            return
        }
        refreshCurrentStep()
        setUploading(true)
        fetch(`${process.env.REACT_APP_HOSTNAME}/api/quizzes/create`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({ 
                    name, 
                    preview, 
                    steps,
                    startTime: startTimeEnabled? startTime : null,
                    endTime: endTimeEnabled? endTime : null,
                    maxTime: maxTimeEnabled? maxTime : null,
                    password: passwordEnabled? password : null,
                    maxTries: maxTries? maxTries : 10,
                    publicResults
                    // intro
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage("ERROR REQ FAILED")
                    setUploading(false)
                    return
                }
                navigate(`/problem/${data.id}`)
            })
    }


    const checkTestsAndExamples = () => {
        for (let step in steps) {
            if(step.type != "problem")continue

            for (var i = 0; i < step.examples.length; i++)
                if (!(step.examples[i].inputValue) || !(step.examples[i].outputValue))
                    return false

            for (var i = 0; i < tests.length; i++)
                if (!(step.tests[i].inputValue) || !(step.tests[i].outputValue))
                    return false
        }

        return true
    }

    const onDeleteHandle = (e, i) => {
        let newSteps = steps.filter(step => step.id != i)
        setSteps(newSteps)
        setCurrentStep(currentStep - 1)
    }

    const getSteps = () => {
        return [{ type: "settings" }, ...steps, { type: "plus" }]
    }

    const addNewStep = () => {
        const newType = (currentType == "article")? "problem" : "article"
        refreshCurrentStep()
        setCurrentType(newType)
        setCurrentStep(steps.length + 1)
        setStepCounter(stepCounter + 1)
        setSteps([...steps, {
            id: stepCounter,
            type: newType,
            editable: true,
            name: "",
            text: "",
            score: (currentType == "article")? 0 : 20,
            files: { stdin: false, stdout: false, inputName: "input.txt", outputName: "output.txt" },
            examples: [{ id: 0, inputValue: "", outputValue: "" }],
            tests: [{ id: 0, inputValue: "", outputValue: "" }]
        }])
    }

    const refreshCurrentStep = () => {
        const newSteps = [...steps]
        newSteps[currentStep - 1] = {
            ...steps[currentStep - 1],
            type: currentType,
            name: stepName,
            text: stepText,
            score: stepScore,
            files: { stdin, stdout, inputName, outputName },
            examples: [...examples],
            tests: [...tests]
        }
        setSteps(newSteps)
    }

    const refreshCurrentItems = () => {
        if (currentStep == 0) return
        const step = steps[currentStep - 1]
        //if (!step) return

        setStepName(step.name)
        setStepText(step.text)
        setCurrentType(step.type)
        setStepScore(step.score)
        setFileTypes({ inputName: step.files.inputName, outputName: step.files.outputName })
        setStreamTypes({ stdin: step.files.stdin, stdout: step.files.stdout })
        setExamples([...step.examples])
        setTests([...step.tests])

        console.log("Set from object")
        console.log(JSON.stringify(step))
    }

    const onStepClick = (i) => {
        if (i <= steps.length) {
            refreshCurrentStep()
            setCurrentStep(i)
        }
        else {
            addNewStep()
        }
    }

    useEffect(() => refreshCurrentStep(), [currentType, stepText]) // maybe remove some
    useEffect(() => {
        refreshCurrentItems()
        refreshCurrentStep()
    }, [currentStep])

    const onSetStdin = (on) => {
        setFileTypes({ inputName: (on ? "STDIN" : "input.txt"), outputName })
        setStreamTypes({ stdin: on, stdout })
    }
    const onSetStdout = (on) => {
        setFileTypes({ inputName, outputName: (on ? "STDOUT" : "output.txt") })
        setStreamTypes({ stdin, stdout: on })
    }

    const onChangeExample = (newExample) => {
        setExamples([...(examples.filter(example => example.id != newExample.id)), newExample].sort((a, b) => a.id - b.id))
        refreshCurrentStep()
    }

    const onDeleteExample = (key) => {
        setExamples(examples.filter(example => example.id != key))
    }

    const onAddExample = () => {
        setExamples([...examples, { id: exampleId + 1, inputValue: "", outputValue: "" }])
        setExampleId(exampleId + 1)
    }

    const onChangeTest = (newTest) => {
        setTests([...(tests.filter(test => test.id != newTest.id)), newTest].sort((a, b) => a.id - b.id))
        refreshCurrentStep()
    }

    const onDeleteTest = (key) => {
        setTests(tests.filter(test => test.id != key))
    }

    const onAddTest = () => {
        setTestId(testId + 1)
        setTests([...tests, { id: testId, inputValue: "", outputValue: "" }])
    }

    

    const stepForm = (steps.length > 0 && currentStep != 0 &&
        <div className="quizForm">
            <div className="tile">
                <div className="typeSwitchContainer inputContainer">
                    <p>Numele pasului</p>
                    <input
                        value={stepName}
                        placeholder="Suma a N numere"
                        onChange={(e) => setStepName(e.target.value)}
                    />
                    <LabelSwitch leftLabel="Articol" rightLabel="Problemă" checked={currentType == "problem"} setChecked={(e) => setCurrentType(e ? "problem" : "article")} />
                </div>
                {
                    currentType == "problem" &&
                    <div className="scoreSwitchContainer">
                        <p>Puncte</p>
                        <input
                            type="number"
                            min={1}
                            value={stepScore}
                            placeholder="Suma a N numere"
                            onChange={(e) => setStepScore(e.target.value)}
                        />
                    </div>
                }
            </div>
            <div className="tile">
                <div className="markdownCodeContainer">
                    <h3>Text</h3>
                    <div className="code-container">
                        <CodeMirror
                            value={stepText}
                            onChange={(e) => setStepText(e)}
                            width="100%"
                            height="40vh"
                            theme="dark"
                            options={{
                                tabSize: 4
                            }}
                        />
                    </div>
                </div>
            </div>
            {
                currentType == "problem" &&
                <div className="tile">
                    <div className="filesContainer">
                        <div className="filesTop">
                            <h3>Fișiere</h3>
                        </div>
                        <div className="fieldsContainer">
                            <p>Fișier de intrare</p>
                            <input disabled={stdin} type="text" maxLength={16} value={inputName} onChange={(e) => setFileTypes({ inputName: e.target.value, outputName })} />
                            <LabelSwitch leftLabel="STDIN" rightLabel="" checked={stdin} setChecked={onSetStdin} />
                        </div>
                        <div className="fieldsContainer">
                            <p>Fișier de ieșire</p>
                            <input disabled={stdout} type="text" maxLength={16} value={outputName} onChange={(e) => setFileTypes({ inputName, outputName: e.target.value })} />
                            <LabelSwitch leftLabel="STDOUT" rightLabel="" checked={stdout} setChecked={onSetStdout} />
                        </div>
                    </div>
                </div>
            }
            {
                currentStep > 0 && currentType == "problem" &&
                <div className="tile">
                    <div className="examplesContainer">
                        <div className="examplesTop">
                            <h3>Exemple</h3>
                            <IconButton text="Adaugă" icon="add" reverse={true} onClickHandle={onAddExample} />
                        </div>
                        <div className="exampleList">
                            {
                                examples.map(example => <DataInput key={example.id} onChangeHandle={onChangeExample} onDelete={onDeleteExample} inputName={inputName} outputName={outputName} {...example} />)
                            }
                        </div>
                    </div>
                </div>
            }
            {
                currentStep > 0 && currentType == "problem" &&
                <div className="tile">
                    <div className="examplesContainer">
                        <div className="examplesTop">
                            <h3>Teste</h3>
                            <IconButton text="Adaugă" icon="add" reverse={true} onClickHandle={onAddTest} />
                        </div>
                        <div className="exampleList">
                            {
                                tests.map(test => <DataInput key={test.id} onChangeHandle={onChangeTest} onDelete={onDeleteTest} inputName={inputName} outputName={outputName} {...test} />)
                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )

    const settingsForm = (
        <div className="quizForm">
            <div className="tile">
                <div className="inputContainer">
                    <p>Numele examenului</p>
                    <input
                        value={name}
                        placeholder="Examen nou"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <div className="tile">
                <div className="textareaContainer">
                    <p>Text descriptiv</p>
                    <textarea
                        rows={5}
                        value={previewText}
                        placeholder="Un examen despre un topic foarte interesant"
                        onChange={(e) => setPreviewText(e.target.value)}
                    />
                </div>
            </div>
            <div className="tile">
                <div className="quizFieldsContainer">
                    <p>Data început</p>
                    <DateTimePicker className="custom-datetime-picker" disabled={!startTimeEnabled} onChange={setStartTime} value={startTime} />
                    <LabelSwitch leftLabel="" rightLabel="" checked={startTimeEnabled} setChecked={(e) => setStartTimeEnabled(e)} />
                </div>
                <div className="quizFieldsContainer">
                    <p>Data sfârșit</p>
                    <DateTimePicker className="custom-datetime-picker" disabled={!endTimeEnabled} onChange={setEndTime} value={endTime} />
                    <LabelSwitch leftLabel="" rightLabel="" checked={endTimeEnabled} setChecked={(e) => setEndTimeEnabled(e)} />
                </div>
                <div className="quizFieldsContainer">
                    <p>Parola</p>
                    <input disabled={!passwordEnabled} type="text" maxLength={20} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="O5p2!-S'11|&" />
                    <LabelSwitch leftLabel="" rightLabel="" checked={passwordEnabled} setChecked={(e) => setPasswordEnabled(e)} />
                </div>
                <div className="quizFieldsContainer">
                    <p>Interval (minute)</p>
                    <input disabled={!maxTimeEnabled} min={1} type="number" maxLength={20} value={maxTime} onChange={(e) => setMaxTime(e.target.value)} placeholder="O5p2!-S'11|&" />
                    <LabelSwitch leftLabel="" rightLabel="" checked={maxTimeEnabled} setChecked={(e) => setMaxTimeEnabled(e)} />
                </div>
                <div className="quizFieldsContainer">
                    <p>Încercări</p>
                    <input type="number" min={1} maxLength={20} value={maxTries} onChange={(e) => setMaxTries(e.target.value)} placeholder="Număr de încercări" />
                </div>
                <div className="quizFieldsContainer">
                    <p>Rezultate publice</p>
                    <div></div>
                    <LabelSwitch leftLabel="" rightLabel="" checked={publicResults} setChecked={(e) => setPublicResults(e)} />
                </div>
            </div>
        </div>
    )

    const noInputElement = (
        <div className="tile noElementFiller">
            <h4>Pentru previzualizare e nevoie de un un titlu și un text descriptiv sau de textul complet al examenului</h4>
        </div>
    )

    const previewElement = (
        <div className="quizPreview">
            {
                name && previewText &&
                <QuizElement id={9999} name={name} rating={5} preview={previewText} views={0} solved={0} solveTries={1} disableLink={true} disableLike={true} />
            }
            {
                //    text &&
                //    <div className="markdown articleContentContainer tile">
                //        <Renderer>{text}</Renderer>
                //    </div>
            }
            {
                !((name && previewText)) && noInputElement
            }
        </div>
    )

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="newQuizContainer quizSolverContainer">
                    <div className="topQuiz tile">
                        <h3>Examen nou</h3>
                        <div className="stepsContainer">
                            {
                                getSteps().map((step, i) => <QuizStep key={i} onDelete={(e, i) => onDeleteHandle(e, i)} onClickHandle={(e) => onStepClick(i)} active={i == currentStep} complete={false} {...step} />)
                            }
                        </div>
                        <div className="topQuizSwitch">
                            <LabelSwitch leftLabel="Editare" rightLabel="Previzualizare" checked={preview} setChecked={setPreview} />
                        </div>
                    </div>
                    {
                        preview || (currentStep == 0 ? settingsForm : stepForm)
                    }
                    {
                        preview && previewElement
                    }
                    <div className="tile quizSubmitter">
                        <h3>Trimitere</h3>
                        {
                            uploading || <IconButton text="Postează" icon="submit" onClickHandle={onUpload} />
                        }
                        {
                            uploading && <p>Se încarcă...</p>
                        }
                    </div>
                </div>
            </Layout>
        </div>
    );
}

export default SubmitQuiz