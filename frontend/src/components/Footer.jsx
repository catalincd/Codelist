import React from "react"
import TextButton from './TextButton'

import { useNavigate } from "react-router-dom"

const Footer = (props) => {

    const navigate = useNavigate()

    const handleAPI = () => {
        navigate(`/api-docs`)
    }

    return (
        <div className="tile footer">
            <p>Catalin Dumitrescu - UVT 2024</p>
            <div className="buttons">
                <TextButton styled={true} text="API" onClickHandle={handleAPI}/>
            </div>
        </div>)
}

export default Footer