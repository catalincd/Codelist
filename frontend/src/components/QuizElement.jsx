import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../utils/UserContext";

import Utils from "../utils/Utils"
import StarsContainer from "./StarsContainer"

const QuizElement = ({id, name, rating, preview, views, solved, solveTries, disableLink, disableLike}) => {

    const { user, setUser } = useContext(UserContext);
    const [liked, setLiked] = useState(user?.likedQuizzes?.includes(id) || false)
    const [userRating, setUserRating] = useState(user?.ratedQuizzes?.find(problem => problem.id == id)?.rating || null)
    const navigate = useNavigate()

    const handleNavigate = () => {
        disableLink || navigate(`/quiz/${id}`)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        user.likedQuizzes = user.likedQuizzes || []
        const newQuizzes = liked ? user.likedQuizzes.filter(_id => _id != id) : [...user.likedQuizzes, id]
        setUser({ ...user, likedQuizzes: newQuizzes })

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/interact`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    id,
                    type: "QUIZ_LIKE",
                    action: liked ? "REMOVE" : "ADD"
                })
            })

        setLiked(!liked)
    }

    const onHandleRating = (rating) => {
        const resetOldRating = (user.likedQuizzes.find(problem => problem.id == id)?.rating == rating) || false
        const newQuizzes = user.likedQuizzes.filter(problem => problem.id != id)
        if(!resetOldRating) 
        newQuizzes.push({id, rating})
        
        setUser({ ...user, likedQuizzes: newQuizzes })
        setUserRating(resetOldRating? null:rating)

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/interact`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    id,
                    type: "QUIZ_RATE",
                    action: rating
                })
            })
        
    }

    return (
        <div onClick={handleNavigate} className="problem">
            <div className="problem-top">
                <div className="problem-name">
                    <p>{name} <span>#{id}</span></p>
                </div>
                <StarsContainer enabled={user? true:false} rating={rating} userRating={userRating} handleRating={onHandleRating}/>
            </div>
            <div className="problem-content">
                <p>{preview}</p>
            </div>
            <div className="problem-bottom">
                <p>{views} <span className="material-symbols-outlined problem-icon">visibility</span></p>
                <p>{Utils.GetSolveRating(solved, solveTries)}% <span className="material-symbols-outlined problem-icon">trending_up</span></p>
                <p>{solved} <span className="material-symbols-outlined problem-icon">task_alt</span></p>
                {
                    user && (!disableLike) &&
                    <div onClick={handleLike} className={liked ? "problem-like-container liked" : "problem-like-container"}>
                        <p><span className="material-symbols-outlined">favorite</span></p>
                    </div>
                }
            </div>
        </div>)
}

export default QuizElement