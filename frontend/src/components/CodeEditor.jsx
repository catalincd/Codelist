import React, { useState, useEffect } from 'react';
import { MenuList } from '@mui/material';
import { saveAs } from 'file-saver';

import CodeMirror from '@uiw/react-codemirror';
import { StreamLanguage } from '@codemirror/language';
import { dracula } from '@uiw/codemirror-theme-dracula';

// import { go } from '@codemirror/legacy-modes/mode/go';

import { cpp } from '@codemirror/lang-cpp'
import { python } from '@codemirror/lang-python'
import { javascript } from '@codemirror/lang-javascript'
import { java } from '@codemirror/lang-java'
import { csharp } from '@replit/codemirror-lang-csharp'

import Utils from "../utils/Utils"

import Dropdown from './Dropdown';
import EditableField from './EditableField';
import IconButton from './IconButton';
import { languages } from '@codemirror/language-data';

import { IoMdClose } from "react-icons/io";
import { FaPlus } from "react-icons/fa";
import { FaP } from 'react-icons/fa6';

const StringToLanguage = (language) => {
    if (language == "cpp") return cpp()
    if (language == "py") return python()
    if (language == "js") return javascript()
    if (language == "java") return java()
    if (language == "cs") return csharp()
}

const GetLanguageExtension = {
    cpp: `cpp`,
    py: `py`,
    js: `js`,
    java: `java`,
    cs: `cs`
}

const GetHelloWordApp = {
    cpp: `#include <iostream>\n\nint main()\n{\n    std::cout<<"Hello World!"<<std::endl;\n    return 0;\n};\n`,
    py: `print("Hello World!")\n`,
    js: `console.log("Hello World!")\n`,
    java: `public class main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
    cs: `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello World!");\n    }\n}\n`
}

const LoadCode = (codeId, defaultCode) => localStorage.getItem(codeId) || defaultCode;


const CodeEditor = ({ enableRun, onRun, onSubmit, inputFiles, inputExamples, codeId, onFullscreen, onExitFullscreen }) => {

    const [language, setLanguage] = useState("cpp");            // TO-DO: SET THIS TO USER PREFERENCE ITEM
    const [languageName, setLanguageName] = useState("C++");
    const [code, setCode] = useState(GetHelloWordApp["cpp"])
    const [isFullscreen, setFullscreen] = useState(false);
    const [fontSize, setFontSize] = useState(16)

    const [files, setFiles] = useState([{ id: 0, name: "main.cpp", code: GetHelloWordApp["cpp"] }, Utils.GetCodeFile(inputFiles, inputExamples)]) // LoadCode(codeId, GetHelloWordApp["cpp"])
    const [fileCount, setFileCount] = useState(2)
    const [currentFile, setCurrentFile] = useState(0)

    const onSetCurrentFile = (_id) => {
        setCurrentFile(_id)
        setCode(files.find(file => file.id == _id).code)
    }

    const onAddFile = (fileName) => {
        setFileCount(fileCount + 1)
        setFiles([...files, { id: fileCount, name: fileName, code: "" }])
    }

    const onDeleteFile = (e, _id) => {
        e.stopPropagation()
        console.log("ON DELETE " + _id)
        setFiles(files.filter(file => file.id != _id))
    }

    const onFileNameChange = (e, _id) => {
        const currentFileObj = files.find(file => file.id == _id)
        setFiles([...files.filter(file => file.id != _id), { ...currentFileObj, name: e.target.value }].sort((a, b) => a.id - b.id))
    }

    const onCodeMod = (newCode) => {    //localStorage.setItem(codeId, newCode)
        setCode(newCode)
        const currentFileObj = files.find(file => file.id == currentFile)
        setFiles([...files.filter(file => file.id != currentFile), { ...currentFileObj, code: newCode }].sort((a, b) => a.id - b.id))
    }

    const changeLanguage = (name, value) => {
        setLanguage(value);
        setLanguageName(name);
        const currentFileObj = files[0]
        setCode(GetHelloWordApp[value])
        setFiles([...files.filter(file => file.id != 0), { ...currentFileObj, name: `main.${GetLanguageExtension[value]}`, code: GetHelloWordApp[value] }].sort((a, b) => a.id - b.id))
    }

    const onSave = () => {
        saveAs(new Blob([code], { type: "text/plain;charset=utf-8" }), `source-code.${GetLanguageExtension[language]}`);
    }

    const toggleFullscreen = () => {
        isFullscreen && document.exitFullscreen()
        isFullscreen || document.getElementById("main-ide").requestFullscreen()

        isFullscreen && document.getElementById("main-ide").classList.remove("isFull")
        isFullscreen || document.getElementById("main-ide").classList.add("isFull")

        setFullscreen(!isFullscreen)
    }

    const onSubmitPreHandle = () => {
        if(isFullscreen) toggleFullscreen()
        onSubmit(files, language)
    }

    useEffect(() => {
        const onFullscreenToggle = () => setFullscreen(Boolean(document.fullscreenElement))
        document.addEventListener('fullscreenchange', onFullscreenToggle);
        return () => document.removeEventListener('fullscreenchange', onFullscreenToggle);
    }, []);




    return (
        <div className="ide-container">
            <div className="command-bar">
                <div className="languageSelector">
                    <Dropdown name={languageName} items={[{ name: "C++", value: "cpp" }, { name: "Python", value: "py" }, { name: "JavaScript", value: "js" }, { name: "C#", value: "cs" }, { name: "Java", value: "java" }]} value={language} onChangeHandle={changeLanguage} />
                </div>
                <div className="command-container">
                    <div className="commands-left">
                        {enableRun && <IconButton text="Run" icon="start" onClickHandle={() => onRun(files, language)} />}
                        {enableRun && <IconButton text="Submit" icon="submit" onClickHandle={() => onSubmitPreHandle()} />}
                        <IconButton text="Save" icon="save" onClickHandle={() => onSave(files, language)} />
                    </div>
                    <div className="commands-right">
                        <IconButton text="" icon="zoomin" onClickHandle={() => setFontSize(fontSize + 2)} />
                        <IconButton text="" icon="zoomout" onClickHandle={() => setFontSize(fontSize - 2)} />
                        <IconButton text={isFullscreen ? "Exit" : ""} icon={isFullscreen ? "exitFullscreen" : "fullscreen"} onClickHandle={toggleFullscreen} />
                    </div>
                </div>
            </div>

            <div className="mirror-container">
                <div className={`file-container limited-width ${isFullscreen? "isFull":""}`}>
                    <div className={"file" + (currentFile == 0 ? " active" : "")} onClick={() => onSetCurrentFile(0)}>
                        <div className="editableField">
                            <p>{files[0].name}</p>
                        </div>
                    </div>
                    {
                        files.filter(file => file.id != 0 && file.id != 9999).map((file, i) => <div key={i} className={"file" + (file.id == 0 ? " main" : "") + (file.id == currentFile ? " active" : "")} onClick={() => onSetCurrentFile(file.id)}>
                            <EditableField text={file.name} onChangeHandle={(e) => onFileNameChange(e, file.id)} />
                            <div className="closeIcon" onClick={(e) => onDeleteFile(e, file.id)}>
                                <IoMdClose />
                            </div>
                        </div>)
                    }
                    <div className="newfile" onClick={() => onAddFile(`file${fileCount}`)}>
                        <FaPlus />
                    </div>
                    {
                        inputFiles?.stdin &&
                        <div className={"stdin" + (currentFile == 9999 ? " active" : "")} onClick={() => onSetCurrentFile(9999)}>
                            <p>STDIN</p>
                        </div>
                    }
                </div>
                <div className={`code-container ${isFullscreen? "isFull":""}`} style={{ fontSize: `${fontSize}px` }}>
                    <CodeMirror
                        value={code}
                        onChange={(e) => onCodeMod(e)}
                        height="75vh"
                        theme="dark"
                        options={{
                            tabSize: 4
                        }}
                        extensions={StringToLanguage(language)}
                    />
                </div>
            </div>
        </div>
    )

}






export default CodeEditor