import React, { useContext, useState, useEffect } from "react"
import { UserContext } from "../utils/UserContext";

const ArticleElement = ({ id, name, rating, preview, views }) => {

    const { user, setUser } = useContext(UserContext);

    const handleLike = (e) => {
        e.stopPropagation()
        console.log(handleLike)
    }

    return (
        <div className="article">
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
                    <div onClick={handleLike} className="article-like-container">
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

export default ArticleElement