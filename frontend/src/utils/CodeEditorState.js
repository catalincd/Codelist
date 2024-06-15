const GetHelloWordApp = {
    cpp: `#include <iostream>\n\nint main()\n{\n    std::cout<<"Hello World!"<<std::endl;\n    return 0;\n};\n`,
    py: `print("Hello World!")\n`,
    js: `console.log("Hello World!")\n`,
    java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
    cs: `using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("Hello World!");\n    }\n}\n`
}

const GetHelloWordFile = {
    cpp: `main.cpp`,
    py: `main.py`,
    js: `main.js`,
    java: `Main.java`,
    cs: `Main.cs`
}


const GetStartFile = (language) => {
    return { id: 0, name: GetHelloWordFile[language], code: GetHelloWordApp[language] }
}


const GetCodeFile = (files, examples) => {
    if (files && !(files.stdin))
        return { id: 1, name: files.inputName, code: examples ? examples[0].inputValue : "" }

    return { id: 9999, name: "__stdin", code: examples ? examples[0].inputValue : "" }
}


const Save = (prefix, codeId, files, language) => {
    localStorage.setItem(`${prefix}_${codeId}`, JSON.stringify({
        language,
        files
    }))
}


const Load = (prefix, codeId, defaultLanguage, inputFiles, inputExamples) => {
    const loadedState = localStorage.getItem(`${prefix}_${codeId}`)
    return loadedState? JSON.parse(loadedState) : {
        language: defaultLanguage,
        files: [GetStartFile(defaultLanguage), GetCodeFile(inputFiles, inputExamples)]
    }
}

export default { Load, Save, GetHelloWordApp}