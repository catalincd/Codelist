import React, { useContext, useState, useEffect } from 'react'
import { TiDeleteOutline } from "react-icons/ti";

const DataInput = ({ id, onDelete, onChangeHandle, inputName, inputValue, outputName, outputValue }) => {

    const [{ iV, oV }, setData] = useState({ iV: inputValue, oV: outputValue })

    useEffect(() => {
        onChangeHandle({ id, inputValue: iV, outputValue: oV })
    }, [iV, oV])


    return (
        <div className="dataInput">
            <div className="fieldContainer">
                <p>{inputName}</p>
                <input type="text" value={iV} onChange={(e) => setData({ iV: e.target.value, oV })} />
            </div>
            <div className="fieldContainer">
                <p>{outputName}</p>
                <input type="text" value={oV} onChange={(e) => setData({ iV, oV: e.target.value })} />
            </div>
            <TiDeleteOutline onClick={() => onDelete(id)} />
        </div>
    )
}

export default DataInput