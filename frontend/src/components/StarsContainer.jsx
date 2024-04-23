import React, { useState, useEffect, useRef } from 'react';
import Utils from "../utils/Utils"

const StarsContainer = ({rating, userRating, handleRating, showUserRating}) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
    const [elementX, setElementX] = useState(null);
    const [elementWidth, setElementWidth] = useState(null);
    const [ratingRatio, setRatingRatio] = useState(0);
    const elementRef = useRef();

    const handleMouseMove = (event) => {
        setMousePosition({
            x: event.clientX,
            y: event.clientY
        });
        
    };

    useEffect(() => {
        if (elementRef.current) {
            const rect = elementRef.current.getBoundingClientRect();
            setElementX(rect.left);
            setElementWidth(rect.width);
        }
    }, []);

    useEffect(() => {
        if(isHovered)
        {
            setRatingRatio(Math.floor(Utils.Clamp(Utils.Clamp((mousePosition.x - elementX)/elementWidth, 0, 1) * 5 + 0.25, 1.0, 5.0) * 2) / 2)
        }
    }, [mousePosition])

    const handleClick = (e) => {
        e.stopPropagation()
        //setUserRating
        handleRating(ratingRatio)
    }

    return (
        <div className={"stars-container" + (userRating? " rated":"")} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onMouseMove={handleMouseMove}>
            <div ref={elementRef} onClick={handleClick} className={"stars"}>
            {
                Utils.GetStarsFromRating(isHovered? ratingRatio:(userRating? userRating:rating))
            }
            </div>
            <p>{parseFloat(isHovered? ratingRatio:(userRating? userRating:rating)).toFixed(1)}</p>
        </div>
    );
};

export default StarsContainer;
