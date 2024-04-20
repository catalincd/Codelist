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



import Dropdown from './Dropdown';
import IconButton from './IconButton';
import { languages } from '@codemirror/language-data';

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
    java: `public class Main {\n        public static void main(String[] args) {\n            System.out.println("Hello, World!");\n        }\n    }\n`,
    cs: `using System;\n\n    class Program\n    {\n        static void Main()\n        {\n            Console.WriteLine("Hello World!");\n        }\n    }\n`
}

const LoadCode = (codeId, defaultCode) => localStorage.getItem(codeId) || defaultCode;


const CodeEditor = ({ enableRun, onRun, onSubmit, codeId, onFullscreen, onExitFullscreen }) => {

    const [language, setLanguage] = useState("cpp");            // TO-DO: SET THIS TO USER PREFERENCE ITEM
    const [languageName, setLanguageName] = useState("C++");
    const [code, setCode] = useState(LoadCode(codeId, GetHelloWordApp["cpp"]))
    const [isFullscreen, setFullscreen] = useState(false);
    const [fontSize, setFontSize] = useState(16)

    const changeLanguage = (name, value) => { setLanguage(value); setLanguageName(name); setCode(GetHelloWordApp[value]); console.log(value); }

    const onSave = () => {
        saveAs(new Blob([code], { type: "text/plain;charset=utf-8" }), `source-code.${GetLanguageExtension[language]}`);
    }

    const onCodeMod = (newCode) => {
        localStorage.setItem(codeId, newCode)
        setCode(newCode)
    }

    const toggleFullscreen = () => {
        isFullscreen && document.exitFullscreen()
        isFullscreen || document.getElementById("main-ide").requestFullscreen()
        setFullscreen(!isFullscreen)
    }

    useEffect(() => {
        const onFullscreenToggle = () => setFullscreen(Boolean(document.fullscreenElement))
        document.addEventListener('fullscreenchange', onFullscreenToggle);
        return () => document.removeEventListener('fullscreenchange', onFullscreenToggle);
    }, []);




    return (
        <div id="main-ide" className="ide-container">
            <div className="command-bar">
                <div className="languageSelector">
                    <Dropdown name={languageName} items={[{ name: "C++", value: "cpp" }, { name: "Python", value: "py" }, { name: "JavaScript", value: "js" }, { name: "C#", value: "cs" }, { name: "Java", value: "java" }]} value={language} onChangeHandle={changeLanguage} />
                </div>
                <div className="command-container">
                    <div className="commands-left">
                        {enableRun && <IconButton text="Run" icon="start" onClickHandle={() => onRun(code, language)} />}
                        {enableRun && <IconButton text="Submit" icon="submit" onClickHandle={() => onSubmit(code, language)} />}
                        <IconButton text="Save" icon="save" onClickHandle={() => onSave(code, language)} />
                    </div>
                    <div className="commands-right">
                        <IconButton text="" icon="zoomin" onClickHandle={() => setFontSize(fontSize + 2)} />
                        <IconButton text="" icon="zoomout" onClickHandle={() => setFontSize(fontSize - 2)} />
                        <IconButton text={isFullscreen ? "Exit" : ""} icon={isFullscreen ? "exitFullscreen" : "fullscreen"} onClickHandle={toggleFullscreen} />
                    </div>
                </div>
            </div>

            <div className="code-container" style={{ fontSize: `${fontSize}px` }}>
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
    )

}






export default CodeEditor