import React from 'react';

import { VscDebugStart } from "react-icons/vsc";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdCloudUpload } from "react-icons/md";
import { IoMdRadioButtonOn } from "react-icons/io";
import { MdFullscreen } from "react-icons/md";
import { MdFullscreenExit } from "react-icons/md";
import { LuSave } from "react-icons/lu";
import { RiZoomInLine } from "react-icons/ri";
import { RiZoomOutLine } from "react-icons/ri";

const IconMap = {
    run: FaRegCirclePlay,
    start: VscDebugStart,
    submit: MdCloudUpload,
    button: IoMdRadioButtonOn,
    save: LuSave,
    zoomin: RiZoomInLine,
    zoomout: RiZoomOutLine,
    fullscreen: MdFullscreen,
    exitFullscreen: MdFullscreenExit
}


const IconButton = ({text, icon, onClickHandle}) => {
    
    const IconElement = IconMap[icon] || IconMap["button"]

    return (
        <div className="iconbutton" onClick={() => {onClickHandle()}}>
            <IconElement />
            {text}
        </div>
    )
}

export default IconButton