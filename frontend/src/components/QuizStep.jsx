import React from "react"

import { MdInfoOutline } from "react-icons/md";
import { MdOutlinePlayCircleOutline } from "react-icons/md";
import { TiDelete } from "react-icons/ti";
import { IoMdSettings } from "react-icons/io";
import { IoMdAddCircleOutline } from "react-icons/io";


const GetTypeElement = (type) => {
    if (type == "problem") return <MdOutlinePlayCircleOutline />
    if (type == "article") return <MdInfoOutline />
    if (type == "settings") return <IoMdSettings />
    if (type == "plus") return <IoMdAddCircleOutline />
    return <p>{type}</p>
}

const QuizStep = ({id, type, active, editable, complete, onDelete, onClickHandle}) => {

    const onDeleteHandle = (e) => {
        e.stopPropagation()
        onDelete(e, id)
    }

    return (
        <div onClick={onClickHandle} className={"quizStep" + (editable? " editable":"") + (active? " active":"") + (complete? " complete":"")}>
            {
                GetTypeElement(type)
            }
            <div className="delete" onClick={(e) => onDeleteHandle(e)}>
                <TiDelete />
            </div>
        </div>)
}

export default QuizStep