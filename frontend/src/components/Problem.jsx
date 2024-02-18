import React, { useContext, useState, useEffect } from "react"

const Problem = (props) => {

    const [errorMessage, setErrorMessage] = useState('')
    const [problemData, setProblemData] = useState(null)


    useEffect(() => {
        const fetchProblemData = async () => {
            fetch(`http://localhost:8080/problems/details?id=${props.id}`,
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

        if(!problemData)
            fetchProblemData()
    }, [])



    return (
        <div className="problem">
            <div className="problem-top">
                <div className="problem-name">
                    <p>{problemData?.name} <span>#{problemData?.id}</span></p>
                </div>
                <div className="problem-stars-container">

                    <p><span className="material-symbols-outlined">star</span></p>
                    <p><span className="material-symbols-outlined">star</span></p>
                    <p><span className="material-symbols-outlined">star</span></p>
                    <p><span className="material-symbols-outlined">star_half</span></p>
                    <p><span className="material-symbols-outlined">star</span></p>

                    <p>{problemData?.rating.toFixed(1)}</p>
                </div>
            </div>
            <div className="problem-content">
                <p>{problemData?.text}</p>
            </div>
            <div className="problem-bottom">
                <p>{problemData?.views} <span className="material-symbols-outlined problem-icon">visibility</span></p>
                <p>{GetSolveRating(problemData)}% <span className="material-symbols-outlined problem-icon">trending_up</span></p>
                <p>{problemData?.solved} <span className="material-symbols-outlined problem-icon">task_alt</span></p>
                <div className="problem-like-container">
                    <p><span className="material-symbols-outlined">favorite</span></p>
                </div>
            </div>
        </div>)
}

const GetSolveRating = (problemData) => (problemData?.solved / Math.max(1, problemData?.solveTries))

export default Problem