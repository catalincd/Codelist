import { BiErrorCircle } from "react-icons/bi";
import { BsMemory } from "react-icons/bs";
import { BsCpu } from "react-icons/bs";



const DefaultProfileImage = `${process.env.REACT_APP_HOSTNAME}/images/default.png`


const GetLanguageExtension = {
    cpp: `cpp`,
    py: `py`,
    js: `js`,
    java: `java`,
    cs: `cs`
}

const GetProgressBar = (tests, message = null) => {
    if(!tests) 
        return (<div></div>)

    const passed = tests.filter(test => test).length
    const ratio = parseInt(100 * parseFloat(passed) / parseFloat(tests.length))
    const widthString = `${ratio}%`

    return (
        <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: widthString }}></div>
            {message ? <p>{message}</p> : <p>{ratio}% ({passed}/{tests.length})</p>}
        </div>
    )
}

const GetMemString = (mem) => {
    var units = ["B", "KB", "MB", "GB"]
    var unitId = 0

    while (mem > 1000) {
        unitId++
        mem /= 1000
    }

    return `${mem.toFixed(1)}${units[unitId]}`
}

const GetExecutionTimeElement = (runtime, loading) => {
    if (loading) return (<div></div>)

    if (runtime.error)
        return (
            <div className="diagnostic-error">
                <h4>Error</h4>
                <BiErrorCircle />
            </div>
        )

    return (
        <div className="diagnostic-success">
            <div className="diagnostic-sub cpu">
                <BsCpu />
                <h4>{`${parseFloat(runtime.time).toFixed(1)}s`}</h4>
            </div>
            <div className="diagnostic-sub memory">
                <BsMemory />
                <h4>{GetMemString(parseFloat(runtime.memory))}</h4>
            </div>
        </div>
    )
}

const GetLoadingResultElement = (results) => {
    return (<div key={99} className="resultRow">
        <h4>{results.length + 1}</h4>
        {GetProgressBar([], "Loading...")}
    </div>)
}

const GetResultElements = (results, showLoadingResult) => {
    let keyIterator = 1

    return results.map(result =>
        <div key={keyIterator++} className="resultRow">
            <h4>{keyIterator}</h4>
            {GetProgressBar(result.tests)}
        </div>)
}


const GetCodeFile = (files, examples) => {
    if(files && !(files.stdin))
        return {id: 1, name: files.inputName, code: examples[0].inputValue}

    return {id: 9999, name: "__stdin", code: examples? examples[0].inputValue : ""}
}

const GetStarsFromRating = (rating) => {
    const stars = []
    let keyIterator = 0

    while (rating >= 1) {
        rating -= 1
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined star-filled">star</span></p>)
    }

    if (rating >= 0.5) {
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined">star_half</span></p>)
    }

    while (stars.length < 5) {
        stars.push(<p key={keyIterator++}><span className="material-symbols-outlined">star</span></p>)
    }

    return stars
}

const GetSolveRating = (solved, solveTries) => (solved / Math.max(1, solveTries))


const Clamp = (x, min, max) => x > max? max : (x < min? min : x)


export default { Clamp, GetSolveRating, GetStarsFromRating, GetCodeFile, DefaultProfileImage, GetLanguageExtension, GetResultElements, GetLoadingResultElement, GetExecutionTimeElement, GetMemString, GetProgressBar }