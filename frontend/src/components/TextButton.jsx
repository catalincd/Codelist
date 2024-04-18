import React from 'react';


const TextButton = ({text, width, onClickHandle, reverse, styled}) => {

    let style = "textbutton" + (reverse? " reverse" : "") + (styled? " styled":"")

    return (
        <div className={style} style={{width: (width? `${width}rem`:"auto")}} onClick={onClickHandle}>
            {text}
        </div>
    )
}

export default TextButton