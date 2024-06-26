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
import { PiPasswordLight } from "react-icons/pi";
import { IoLogInOutline } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";


const IconMap = {
    run: FaRegCirclePlay,
    start: VscDebugStart,
    submit: MdCloudUpload,
    button: IoMdRadioButtonOn,
    save: LuSave,
    zoomin: RiZoomInLine,
    zoomout: RiZoomOutLine,
    fullscreen: MdFullscreen,
    exitFullscreen: MdFullscreenExit,
    password: PiPasswordLight,
    login: IoLogInOutline,
    logout: IoLogOutOutline,
    add: FaPlus,
    delete: TiDeleteOutline,
}


const IconButton = ({text, icon, onClickHandle, reverse, styled}) => {
    
    const IconElement = IconMap[icon] || IconMap["button"]
    let style = "iconbutton" + (reverse? " reverse" : "") + (styled? " styled":"")

    const normalIconButton = (
        <div className={style} onClick={() => {onClickHandle()}}>
            <IconElement />
            {text}
        </div>
    )

    const reverseIconButton = (
        <div className={style} onClick={() => {onClickHandle()}}>
            {text}
            <IconElement />
        </div>
    )

    return (reverse? reverseIconButton : normalIconButton)
}

export default IconButton