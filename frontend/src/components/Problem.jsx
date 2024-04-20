import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { UserContext } from "../utils/UserContext";


const Problem = (props) => {

    
    const [errorMessage, setErrorMessage] = useState('')
    const [problemData, setProblemData] = useState(null)

    useEffect(() => {
        const fetchProblemData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/api/problems/details?id=${props.id}`,
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

            console.log("FETCHED FROM PROBLEM")
        }

        if (!problemData)
            fetchProblemData()
    }, [])


    return (
        <ProblemElement id={props.id} data={problemData} />
    )
}

const ProblemElement = (props) => {

    const { user, setUser } = useContext(UserContext);

    const problemData = props.data

    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(`/solver?id=${problemData?.id}`)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        console.log(handleLike)
    }

    return (
        <div onClick={handleNavigate} className="problem">
            <div className="problem-top">
                <Link className="problem-name">
                    <p>{problemData?.name} <span>#{problemData?.id}</span></p>
                </Link>
                <div className="problem-stars-container">

                    {GetStarsFromRating(problemData?.rating)}

                    <p>{parseFloat(problemData?.rating / 10).toFixed(1)}</p>
                </div>
            </div>
            <Link className="problem-content">
                <p>{problemData?.preview}</p>
            </Link>
            <div className="problem-bottom">
                <p>{problemData?.views} <span className="material-symbols-outlined problem-icon">visibility</span></p>
                <p>{GetSolveRating(problemData)}% <span className="material-symbols-outlined problem-icon">trending_up</span></p>
                <p>{problemData?.solved} <span className="material-symbols-outlined problem-icon">task_alt</span></p>
                {
                    user &&
                    <div onClick={handleLike} className="problem-like-container">
                        <p><span className="material-symbols-outlined">favorite</span></p>
                    </div>
                }
            </div>
        </div>)
}

const GetStarsFromRating = (rating) => {
    const stars = []
    let keyIterator = 0

    while (rating > 10) {
        rating -= 10
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined problem-star-filled">star</span></p>)
    }

    if (rating > 5) {
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined">star_half</span></p>)
    }

    while (stars.length < 5) {
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined">star</span></p>)
    }

    return stars
}

const GetSolveRating = (problemData) => (problemData?.solved / Math.max(1, problemData?.solveTries))

export default Problem