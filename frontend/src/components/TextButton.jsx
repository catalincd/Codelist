import React from 'react';


const TextButton = ({text, width, onClickHandle}) => {
    return (

        <div className="textbutton" style={{width: (width? `${width}rem`:"auto")}} onClick={onClickHandle}>
            {text}
        </div>
    )
}

export default TextButton