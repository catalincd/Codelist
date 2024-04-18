import React, { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import Layout from "../components/Layout"
import ArticleElement from "../components/ArticleElement"
import ReactMarkdown from 'react-markdown'

const Reader = (props) => {

  const { id } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [articleData, setArticleData] = useState(null)

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/articles/?id=${id}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setErrorMessage(data.error)
          return
        }
        setArticleData(data)
        console.log(data)
      })
  }, [])



  return (
    <div className="mainContainer">
      <Layout error={errorMessage} setError={setErrorMessage}>
        <div className="problemsPageContainer">
          {
            articleData &&
            <ArticleElement {...articleData} />
          }
          {
            articleData &&
            <div class="markdown articleContentContainer tile">
              <ReactMarkdown>{articleData.text}</ReactMarkdown>
            </div>
          }
        </div>
      </Layout>
    </div>
  )
}


export default Reader