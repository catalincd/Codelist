import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Layout from "../components/Layout"
import LabelSwitch from "../components/LabelSwitch"
import IconButton from "../components/IconButton"
import DataInput from "../components/DataInput"
import Example from "../components/Example"

import Renderer from '../components/Renderer'

import CodeMirror from '@uiw/react-codemirror';
import { UserContext } from "../utils/UserContext"
import ProblemElement from "../components/ProblemElement"

const SubmitProblem = (props) => {

    document.title = `Codelist - Problemă nouă`

    const { user, setUser } = useContext(UserContext)
    const [preview, setPreview] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [uploading, setUploading] = useState(false)

    const [name, setName] = useState('')
    const [previewText, setPreviewText] = useState('')
    const [text, setText] = useState('')

    const [{ stdin, stdout }, setStreamTypes] = useState({ stdin: false, stdout: false })
    const [{ inputName, outputName }, setFileTypes] = useState({ inputName: "input.txt", outputName: "output.txt" })
   
    const [exampleId, setExampleId] = useState(0)
    const [examples, setExamples] = useState([{ id: 0, inputValue: "", outputValue: "" }])

    const [testId, setTestId] = useState(0)
    const [tests, setTests] = useState([{ id: 0, inputValue: "", outputValue: "" }])

    const navigate = useNavigate()
    const noInput = (name && previewText || text) ? true : false

    const onUpload = async () => {
        if (name == "" || previewText == "" || !checkTestsAndExamples()) {
            setErrorMessage("Completați toate câmpurile")
            return
        }
        setUploading(true)
        fetch(`${process.env.REACT_APP_HOSTNAME}/api/problems`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({ name, preview: previewText, files: {stdin, stdout, inputName, outputName}, text, tests, examples })
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
        for(var i=0;i<examples.length;i++)
            if(!(examples[i].inputValue) || !(examples[i].outputValue))
                return false

        for(var i=0;i<tests.length;i++)
            if(!(tests[i].inputValue) || !(tests[i].outputValue))
                return false
        
        return true
    }

    const onChangeTest = (newTest) => {
        setTests([...(tests.filter(test => test.id != newTest.id)), newTest].sort((a, b) => a.id - b.id))
    }

    const onDeleteTest = (key) => {
        setTests(tests.filter(test => test.id != key))
    }

    const onAddTest = () => {
        setTestId(testId + 1)
        setTests([...tests, { id: testId, inputValue: "", outputValue: "" }])
    }

    const onChangeExample = (newExample) => {
        setExamples([...(examples.filter(example => example.id != newExample.id)), newExample].sort((a, b) => a.id - b.id))
    }

    const onDeleteExample = (key) => {
        setExamples(examples.filter(example => example.id != key))
    }

    const onAddExample = () => {
        setExampleId(exampleId + 1)
        setExamples([...examples, { id: exampleId, inputValue: "", outputValue: "" }])
    }

    const onSetStdin = (on) => {
        setFileTypes({ inputName: (on ? "STDIN" : "input.txt"), outputName })
        setStreamTypes({ stdin: on, stdout })
    }
    const onSetStdout = (on) => {
        console.log(on)
        setFileTypes({ inputName, outputName: (on ? "STDOUT" : "output.txt") })
        setStreamTypes({ stdin, stdout: on })
    }

    const problemForm = (
        <div className="problemForm">
            <div className="tile">
                <div className="inputContainer">
                    <h3>Numele problemei</h3>
                    <input
                        value={name}
                        placeholder="Problemă nouă"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
            </div>
            <div className="tile">
                <div className="textareaContainer">
                    <h3>Text descriptiv</h3>
                    <textarea
                        rows={5}
                        value={previewText}
                        placeholder="O problemă foarte greu de rezolvat..."
                        onChange={(e) => setPreviewText(e.target.value)}
                    />
                </div>
            </div>
            <div className="tile">
                <div className="markdownCodeContainer">
                    <h3>Text complet</h3>
                    <div className="code-container">
                        <CodeMirror
                            value={text}
                            onChange={(e) => setText(e)}
                            width="100%"
                            height="60vh"
                            theme="dark"
                            options={{
                                tabSize: 4
                            }}
                        />
                    </div>
                </div>
            </div>
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
        </div>
    )

    const noInputElement = (
        <div className="tile noElementFiller">
            <h4>Pentru previzualizare este nevoie de un titlu și un text descriptiv sau de textul complet al problemei</h4>
        </div>
    )

    const examplesElement = (
        <div className="ide-examples-container tile">
            <div className="top-bar">
              <div className="example-name">
                <h4>Exemple</h4>
              </div>
            </div>
            <div className="ide-examples">
              {
                examples?.map((example) => <Example key={example.inputValue} {...example} {...{stdin, stdout, inputName, outputName}} />)
              }
            </div>
          </div>
    )

    const previewElement = (
        <div className="problemPreview">
            {
                name && previewText &&
                <ProblemElement id={9999} name={name} rating={5} preview={previewText} views={0} tests={tests} solved={0} solveTries={1} disableLink={true} disableLike={true} />
            }
            {
                text &&
                <div className="markdown problemContentContainer tile">
                    <Renderer>{text}</Renderer>
                </div>
            }
            {
                noInput && examplesElement
            }
            {
                noInput || noInputElement
            }
        </div>
    )


    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="newProblemContainer">
                    <div className="newProblemTop tile">
                        <h3>Problemă nouă</h3>
                        <LabelSwitch leftLabel="Editare" rightLabel="Previzualizare" checked={preview} setChecked={setPreview} />
                    </div>
                    {
                        preview || problemForm
                    }
                    {
                        preview && previewElement
                    }
                    <div className="tile problemSubmitter">
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

export default SubmitProblem