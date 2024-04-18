import React from "react"
import Switch from '@mui/material/Switch';


const LabelSwitch = ({leftLabel, rightLabel, checked, setChecked}) => {

    const handleOnChange = (e) => setChecked(e.target.checked)

    return (
        <div className="labelswitch">
            <p>{leftLabel}</p>
            <Switch color="warning" checked={checked} onChange={handleOnChange} />
            <p>{rightLabel}</p>
        </div>)
}

export default LabelSwitch