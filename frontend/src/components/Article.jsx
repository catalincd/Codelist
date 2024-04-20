import React, { useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom";
import { UserContext } from "../utils/UserContext";

const Article = ({ id, name, rating, preview, views }) => {

    const { user, setUser } = useContext(UserContext);
    const [liked, setLiked] = useState(user?.likedArticles?.includes(id) || false)
    const navigate = useNavigate()

    const handleNavigate = () => {
        navigate(`/article/${id}`)
    }

    const handleLike = (e) => {
        e.stopPropagation()
        const newArticles = liked ? user.likedArticles.filter(_id => _id != id) : [...user.likedArticles, id]
        setUser({ ...user, likedArticles: newArticles })

        console.log("FETCHING")

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

    return (
        <div onClick={handleNavigate} className="article">
            <div className="article-top">
                <div className="article-name">
                    <p>{name} <span>#{id}</span></p>
                </div>
                <div className="article-stars-container">

                    {GetStarsFromRating(rating)}

                    <p>{parseFloat(rating / 10).toFixed(1)}</p>
                </div>
            </div>
            <div className="article-content">
                <p>{preview}</p>
            </div>
            <div className="article-bottom">
                <p>{views} <span className="material-symbols-outlined article-icon">visibility</span></p>
                {
                    user &&
                    <div onClick={handleLike} className={liked ? "article-like-container liked" : "article-like-container"}>
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

export default Article