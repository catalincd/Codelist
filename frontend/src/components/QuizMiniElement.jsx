import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../utils/UserContext";

import Utils from "../utils/Utils"
import StarsContainer from "./StarsContainer"

const QuizMiniElement = ({ id, name, maxTime, maxScore, disableLink, maxTries}) => {

    const { user, setUser } = useContext(UserContext);
    
    const currentTries = user? (user.quizzes? (user.quizzes[id]? user.quizzes[id].length : 0) : 0) : 0

    const navigate = useNavigate()

    const handleNavigate = () => {
        disableLink || navigate(`/quiz/${id}`)
    }

    return (
        <div onClick={handleNavigate} className="quiz-mini">
            <div className="quiz-name">
                <p>{name} <span>#{id}</span></p>
            </div>
            <div className="quiz-details">
                {
                  user &&
                  <p><span className={maxTries && maxTries == currentTries? "out" : ""}>{currentTries}</span>/<span>{maxTries}</span> Încercări</p>
                }
                {
                    maxTime &&
                    <p className="minutes">{maxTime} minute</p>
                }
                <p className="points">{maxScore} {maxScore>19? "de ":""}puncte</p>
            </div>
        </div>)
}

export default QuizMiniElement