import React from "react"

import { MdInfoOutline } from "react-icons/md";
import { MdOutlinePlayCircleOutline } from "react-icons/md";
import { TiDelete } from "react-icons/ti";

const QuizStep = ({type, active, editable, complete, onDelete, onClickHandle}) => {

    const onDeleteHandle = (e) => {
        e.stopPropagation()
        onDelete(e)
    }

    return (
        <div onClick={onClickHandle} className={"quizStep" + (editable? " editable":"") + (active? " active":"") + (complete? " complete":"")}>
            {
                (type == "problem") && <MdOutlinePlayCircleOutline />
            }
            {
                (type == "problem") || <MdInfoOutline />
            }
            <div className="delete" onClick={onDeleteHandle}>
                <TiDelete />
            </div>
        </div>)
}

export default QuizStep