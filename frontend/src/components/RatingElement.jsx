import React from 'react';
import { Link } from 'react-router-dom';



const RatingElement = ({ name, id, rating, solved, link }) => {


    return (
        <Link to={link} className="ratingElement">
            <p>{name} #{id}</p>
            <div className="stars-container">
                {GetStarsFromRating(rating * 10)}
                <p>{parseFloat(rating).toFixed(1)}</p>
            </div>
        </Link>
    )
}

const GetStarsFromRating = (rating) => {
    const stars = []
    let keyIterator = 0

    while (rating >= 10) {
        rating -= 10
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined problem-star-filled">star</span></p>)
    }

    if (rating >= 5) {
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined">star_half</span></p>)
    }

    while (stars.length < 5) {
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined">star</span></p>)
    }

    return stars
}

export default RatingElement