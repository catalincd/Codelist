import React, { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom";

const ProblemElement = (props) => {

    const problemData = props.data

    return (
        <div className="problem">
            <div className="problem-top">
                <div className="problem-name">
                    <p>{problemData?.name} <span>#{problemData?.id}</span></p>
                </div>
                <div className="problem-stars-container">

                    {GetStarsFromRating(problemData?.rating)}

                    <p>{parseFloat(problemData?.rating / 10).toFixed(1)}</p>
                </div>
            </div>
            <div className="problem-content">
                <p>{problemData?.preview}</p>
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

export default ProblemElement