import React from "react"

import { useNavigate } from "react-router-dom"
import Utils from "../utils/Utils"

import { MdOutlineDoNotDisturbOn } from "react-icons/md";
import { MdTaskAlt } from "react-icons/md";
import { BiErrorCircle } from "react-icons/bi";
import { BsMemory } from "react-icons/bs";
import { BsCpu } from "react-icons/bs";


const ResultElement = ({id, tests, error, time, memory, createdAt}) => {

    

    const passed = tests.filter(test => test).length
    const ratio = parseInt(100 * parseFloat(passed) / parseFloat(tests.length))
    const widthString = `${ratio}%`

    const outputColor = error? "red" : (tests.length == passed? "lime" : "orange");
    const icon = error? <BiErrorCircle /> : (tests.length == passed? <MdTaskAlt /> : <MdOutlineDoNotDisturbOn />);

    const date = new Date(Date.parse(createdAt))
    const timeString = `${date.getHours() < 10? "0"+date.getHours() : date.getHours()}:${date.getMinutes() < 10? "0"+date.getMinutes() : date.getMinutes()}`

    const ratioColor = (tests.length == passed && tests.length > 0)? "lime" : "white";

    return (
        <div className="resultRow">
            <p className="title">{timeString}</p>
            
            <div className="resultDetails">
                <div className="output" style={{ color: outputColor}}>
                {
                    icon
                }
                </div>

                <div className="diagnostic-sub cpu">
                    <BsCpu />
                    <p>{`${parseFloat(time).toFixed(1)}s`}</p>
                </div>
                <div className="diagnostic-sub memory">
                    <BsMemory />
                    <p>{Utils.GetMemString(parseFloat(memory))}</p>
                </div>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ width: widthString }}></div>
                <p style={{ color: ratioColor }}>{ratio || 0}% ({passed}/{tests.length})</p>
            </div>
            
        </div>
    )
}

export default ResultElement