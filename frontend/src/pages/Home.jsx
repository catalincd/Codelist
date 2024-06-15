import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import UploadedElement from '../components/UploadedElement';

import { UserContext } from "../utils/UserContext";

const Home = (props) => {

    document.title = `Codelist - Home`

    console.log("START HOME")

    const { user, setUser } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('')
    const [codelistData, setCodelistData] = useState(null);

    useEffect(() => {
        console.log("FETCHING HOME DATA")
        fetch(`${process.env.REACT_APP_HOSTNAME}/api/data/home`,
            {
                method: "GET"
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error)
                    return
                }
                setCodelistData(data)
                console.log(data)
            })
            .catch(error => console.error(error));
    }, [])

    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                <div className="homePageContainer tile">
                    {
                        codelistData &&
                        <div className="statsContainer">
                            <div className="stat">
                                <h2>{codelistData.problemsCount}</h2>
                                <p>Probleme</p>
                            </div>
                            <div className="stat">
                                <h2>{codelistData.articlesCount}</h2>
                                <p>Articole</p>
                            </div>
                            <div className="stat">
                                <h2>{codelistData.usersCount}</h2>
                                <p>Utilizatori</p>
                            </div>
                        </div>
                    }
                    {
                        codelistData &&
                        <div className="randomData">
                            <div className="randomSection randomProblems">
                                <h3>Probleme aleatorii</h3>
                                <div className="randomContainer">
                                {
                                    codelistData.randomProblems.map((item, id) => <UploadedElement key={id} {...item} link={`/problem/${item.id}`} />)
                                }
                                </div>
                            </div>
                            <div className="randomSection randomArticles">
                                <h3>Articole aleatorii</h3>
                                <div className="randomContainer">
                                {
                                    codelistData.randomArticles.map((item, id) => <UploadedElement key={id} {...item} link={`/article/${item.id}`} />)
                                }
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </Layout>
        </div>
    );
}
export default Home;