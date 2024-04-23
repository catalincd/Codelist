import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../utils/UserContext";

import Utils from "../utils/Utils"
import StarsContainer from "./StarsContainer"

const ProblemElement = ({id, name, rating, preview, views, solved, solveTries, disableLink, disableLike}) => {

    const { user, setUser } = useContext(UserContext);
    const [liked, setLiked] = useState(user?.likedProblems?.includes(id) || false)
    const [userRating, setUserRating] = useState(user?.ratedProblems?.find(problem => problem.id == id)?.rating || null)
    const navigate = useNavigate()

    const handleNavigate = () => {
        disableLink || navigate(`/problem/${id}`)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        const newProblems = liked ? user.likedProblems.filter(_id => _id != id) : [...user.likedProblems, id]
        setUser({ ...user, likedProblems: newProblems })

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/interact`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    id,
                    type: "PROBLEM_LIKE",
                    action: liked ? "REMOVE" : "ADD"
                })
            })

        setLiked(!liked)
    }

    const onHandleRating = (rating) => {
        const newProblems = [...user.ratedProblems.filter(problem => problem.id != id), {id, rating}]
        setUser({ ...user, ratedProblems: newProblems })
        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/interact`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    id,
                    type: "PROBLEM_RATE",
                    action: rating
                })
            })
        setUserRating(rating)
    }

    return (
        <div onClick={handleNavigate} className="problem">
            <div className="problem-top">
                <div className="problem-name">
                    <p>{name} <span>#{id}</span></p>
                </div>
                <StarsContainer rating={rating} userRating={userRating} handleRating={onHandleRating}/>
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

export default ProblemElement