import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import Layout from "../components/Layout"
import LabelSwitch from "../components/LabelSwitch"
import IconButton from "../components/IconButton"
import ArticleElement from "../components/ArticleElement"
import ReactMarkdown from 'react-markdown'

import CodeMirror from '@uiw/react-codemirror';
import { UserContext } from "../utils/UserContext"

import Renderer from "../components/Renderer"


const SubmitArticle = (props) => {

    const { user, setUser } = useContext(UserContext)
    const [preview, setPreview] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [uploading, setUploading] = useState(false)

    const [name, setName] = useState('')
    const [previewText, setPreviewText] = useState('')
    const [text, setText] = useState('')

    const navigate = useNavigate()

    const onUpload = async () => {

        if (name == "" || previewText == "" || text == "") {
            setErrorMessage("Completați toate câmpurile")
            return
        }


        setUploading(true)

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/articles/`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({ name, preview: previewText, text })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error)
                    setUploading(false)
                    return
                }
                navigate(`/article/${data.id}`)
            })




    }

    const articleForm = (
        <div className="articleForm">
            <div className="tile">
                <div className="inputContainer">
                    <p>Numele articolului</p>
                    <input
                        value={name}
                        placeholder="Articol nou"
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
                        placeholder="Un articol despre un topic foarte interesant"
                        onChange={(e) => setPreviewText(e.target.value)}
                    />
                </div>
            </div>
            <div className="tile">
                <div className="markdownCodeContainer">
                    <p>Text complet</p>
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
        </div>
    )

    const noInputElement = (
        <div className="tile noElementFiller">
            <h4>Pentru previzualizare e nevoie de un un titlu și un text descriptiv sau de textul complet al articolului</h4>
        </div>
    )

    const previewElement = (
        <div className="articlePreview">
            {
                name && previewText &&
                <ArticleElement id={9999} name={name} rating={5} preview={previewText} views={0} />
            }
            {
                text &&
                <div className="markdown articleContentContainer tile">
                    <Renderer>{text}</Renderer>
                </div>
            }
            {
                ((name && previewText) || text) && noInputElement
            }
        </div>
    )

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="newArticleContainer">
                    <div className="newArticleTop tile">
                        <h3>Articol nou</h3>
                        <LabelSwitch leftLabel="Editare" rightLabel="Previzualizare" checked={preview} setChecked={setPreview} />
                    </div>
                    {
                        preview || articleForm
                    }
                    {
                        preview && previewElement
                    }
                    <div className="tile articleSubmitter">
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

export default SubmitArticle