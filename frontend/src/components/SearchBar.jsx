import React, { useState } from "react"
import TextButton from './TextButton'
import { IoSearch } from "react-icons/io5"
import { MdClear } from "react-icons/md"
import { useNavigate } from "react-router-dom"

const SearchBar = ({onChange, inputPlaceholder, hasPassword}) => {

    const [text, setText] = useState("")
    const [code, setCode] = useState("")
    const [password, setPassword] = useState("")

    const handleOnChange = (e) => {
        const filtered = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '')
        setText(filtered)
        setCode("")
        onChange && onChange(filtered, "")
    }

    const handleOnCodeChange = (e) => {
        const filtered = e.target.value.replace(/[^0-9]/g, '')
        setCode(filtered)
        setText("")
        onChange && onChange("", filtered)
    }

    const handleOnPasswordChange = (e) => {
        const filtered = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
        setCode("")
        setText("")
        setPassword(filtered)
        onChange && onChange("", "", filtered)
    }

    const handleOnClear = (e) => {
        setText("")
        setCode("")
        setPassword("")
        onChange && onChange("", "", "")
    }

    return (
        <div className={hasPassword? "tile searchBar hasPassword" : "tile searchBar"}>
            <div className="inputContainer main">
                <input type="text" value={text} onChange={handleOnChange} placeholder={inputPlaceholder} />
                <div className="icon"><IoSearch /></div>
            </div>

            <div className="inputContainer code">
                <input type="text" value={code} onChange={handleOnCodeChange} placeholder="Cod" />
                <div className="icon"><IoSearch /></div>
            </div>

            {
                hasPassword &&
                <div className="inputContainer password">
                <input type="password" value={password} onChange={handleOnPasswordChange} placeholder="Parolă" />
            </div>
            }

            <div className="clearContainer" onClick={handleOnClear}>
                <MdClear />
            </div>
        </div>)
}

export default SearchBar