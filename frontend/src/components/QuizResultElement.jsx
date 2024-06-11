import React from "react"

import { useNavigate } from "react-router-dom"
import Utils from "../utils/Utils"

import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { BsMemory } from "react-icons/bs";
import { BsCpu } from "react-icons/bs";


const QuizResultElement = ({id, stepName, tests, error, time, memory, score, maxScore}) => {

    const noTests = !tests

    const passed = noTests? 0 : tests.filter(test => test).length
    const ratio = noTests? 0 : parseInt(100 * parseFloat(passed) / parseFloat(tests.length))
    const widthString = `${ratio}%`

    const outputColor = noTests? "red" : error? "red" : (tests.length == passed? "lime" : "orange");
    const icon = noTests? <BiErrorCircle /> : error? <BiErrorCircle /> : (tests.length == passed? <MdTaskAlt /> : <MdOutlineDoNotDisturbOn />);

    const ratioColor = noTests? "white" : (tests.length == passed && tests.length > 0)? "lime" : "white";

    return (
        <div className="resultRow">
            <p className="title">{stepName}</p>
            
            <div className="resultDetails">
                <div className="output" style={{ color: outputColor}}>
                {
                    icon
                }
                </div>

                <div className="diagnostic-sub cpu">
                    <BsCpu />
                    <p>{time == undefined? '-' : `${parseFloat(time).toFixed(1)}s`}</p>
                </div>
                <div className="diagnostic-sub memory">
                    <BsMemory />
                    <p>{memory == undefined? '-' : Utils.GetMemString(parseFloat(memory))}</p>
                </div>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: widthString }}></div>
                <p style={{ color: ratioColor }}>{score || 0}/{maxScore}</p>
            </div>
            
        </div>
    )
}

export default QuizResultElement