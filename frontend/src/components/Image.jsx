import React, { useState } from "react"

const Image = ({src, altSrc}) => {
    const [imgSrc, setImgSrc] = useState(src)

    return (
        <img src={imgSrc} onError={() => setImgSrc(altSrc)}/>
    )
}

export default Image