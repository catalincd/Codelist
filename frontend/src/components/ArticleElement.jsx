import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../utils/UserContext";
import { useNavigate } from "react-router-dom"

import StarsContainer from "./StarsContainer"

const ArticleElement = ({ id, name, rating, preview, views, disableLink, disableLike }) => {

    const { user, setUser } = useContext(UserContext);
    const [liked, setLiked] = useState(user?.likedArticles?.includes(id) || false)
    const [userRating, setUserRating] = useState(user?.ratedArticles?.find(problem => problem.id == id)?.rating || null)

    useEffect(() => {
        setLiked(user?.likedArticles?.includes(id) || false)
    }, [user])

    const navigate = useNavigate()

    const handleNavigate = () => {
        disableLink || navigate(`/article/${id}`)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        const newArticles = liked ? user.likedArticles.filter(_id => _id != id) : [...user.likedArticles, id]
        setUser({ ...user, likedArticles: newArticles })

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/interact`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    id,
                    type: "ARTICLE_LIKE",
                    action: liked ? "REMOVE" : "ADD"
                })
            })

        setLiked(!liked)
    }

    const onHandleRating = (rating) => {
        const resetOldRating = (user.ratedArticles.find(problem => problem.id == id)?.rating == rating) || false
        const newProblems = user.ratedArticles.filter(problem => problem.id != id)
        if(!resetOldRating) 
            newProblems.push({id, rating})
        
        setUser({ ...user, ratedArticles: newProblems })
        setUserRating(resetOldRating? null:rating)

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/interact`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    id,
                    type: "ARTICLE_RATE",
                    action: rating
                })
            })
        
    }

    return (
        <div className="article" onClick={handleNavigate}>
            <div className="article-top">
                <div className="article-name">
                    <p>{name} <span>#{id}</span></p>
                </div>
                <StarsContainer enabled={user? true:false} rating={rating} userRating={userRating} handleRating={onHandleRating}/>  
            </div>
            <div className="article-content">
                <p>{preview}</p>
            </div>
            <div className="article-bottom">
                <p>{views} <span className="material-symbols-outlined article-icon">visibility</span></p>
                {
                    user && (!disableLike) &&
                    <div onClick={handleLike} className={liked ? "article-like-container liked" : "article-like-container"}>
                        <p><span className="material-symbols-outlined">favorite</span></p>
                    </div>
                }
            </div>
        </div>
    )
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

export default ArticleElement