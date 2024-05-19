import React, { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useParams } from "react-router"
import Layout from "../components/Layout"
import ArticleElement from "../components/ArticleElement"
import Renderer from "../components/Renderer"
import Utils from "../utils/Utils";

const Reader = (props) => {

  document.title = `Codelist - Articol`

  const { id } = useParams()
  const [errorMessage, setErrorMessage] = useState('')
  const [creatorData, setCreatorData] = useState(null)
  const [articleData, setArticleData] = useState(null)

  const fetchUserData = async (username) => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/api/data/user/${username}`,
      {
        method: "GET"
      })
      .then(response => response.json())
      .then(data => setCreatorData(data))
  }

  useEffect(() => {
    fetch(`${process.env.REACT_APP_HOSTNAME}/api/articles/?id=${id}`,
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
        document.title = `Codelist - ${data.name}`
        fetchUserData(data.creator)
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
            <div className="markdown articleContentContainer tile">
              <Renderer>{articleData.text}</Renderer>
            </div>
          }
          {
            articleData &&
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
                    <Link to={`/user/${articleData?.creator}`}>
                      <p>{articleData?.creator}</p>
                      <img src={Utils.GetUserPicture(creatorData)} />
                    </Link>
                  </div>
                </div>
                <div className="limits">
                  <div className="mem">
                    <p>{new Date(Date.parse(articleData?.createdAt)).toLocaleDateString("RO-ro")}</p>
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


export default Reader