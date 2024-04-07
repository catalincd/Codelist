import React, { useContext, useState, useEffect } from "react"
import { Link } from "react-router-dom";

const ProblemSubmitElement = (props) => {

    return (
        <div className="problem submit-element">
            <div className="problem-top">
                <div className="problem-name">
                    <p>Problema nouă...</p>
                </div>
            </div>
            <div className="problem-content">
                <p>Trimite o problema nouă...</p>
            </div>
            <div className="problem-bottom">
                
            </div>
        </div>)
}

const GetSolveRating = (problemData) => (problemData?.solved / Math.max(1, problemData?.solveTries))

export default ProblemSubmitElement