import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../utils/UserContext";

const ProblemElement = ({id, name, rating, preview, views, solved, solveTries, disableLink, disableLike}) => {

    const { user, setUser } = useContext(UserContext);
    const [liked, setLiked] = useState(user?.likedProblems?.includes(id) || false)
    const navigate = useNavigate()

    const handleNavigate = () => {
        disableLink || navigate(`/problem/${id}`)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        const newArticles = liked ? user.likedProblems.filter(_id => _id != id) : [...user.likedProblems, id]
        setUser({ ...user, likedProblems: newArticles })

        fetch(`${process.env.REACT_APP_HOSTNAME}/auth/interact`,
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

    return (
        <div onClick={handleNavigate} className="problem">
            <div className="problem-top">
                <div className="problem-name">
                    <p>{name} <span>#{id}</span></p>
                </div>
                <div className="problem-stars-container">

                    {GetStarsFromRating(rating)}

                    <p>{parseFloat(rating / 10).toFixed(1)}</p>
                </div>
            </div>
            <div className="problem-content">
                <p>{preview}</p>
            </div>
            <div className="problem-bottom">
                <p>{views} <span className="material-symbols-outlined problem-icon">visibility</span></p>
                <p>{GetSolveRating(solved, solveTries)}% <span className="material-symbols-outlined problem-icon">trending_up</span></p>
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

const GetSolveRating = (solved, solveTries) => (solved / Math.max(1, solveTries))

export default ProblemElement