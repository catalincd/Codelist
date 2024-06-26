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
    if (!tests)
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

const ScrollToRuntime = () => {
    const runtimeElement = document.getElementById("ide-runtime")
    if (runtimeElement)
        runtimeElement.scrollIntoView({ behavior: 'smooth', block: "center" })
    else
        setTimeout(ScrollToRuntime, 50)
}

const CountdownRenderer = ({hours, minutes, seconds}) => {
    return <p>
        {
            hours > 0 && <span>{hours}</span>
        }
        {
            hours > 0 && <span class="dots">:</span>
        }
        {
            <span>{minutes > 9? minutes : `0${minutes}`}</span>
        }
        <span class="dots">:</span>
        {
            <span>{seconds > 9? seconds : `0${seconds}`}</span>
        }
    </p>
}

const GetSolveRating = (solved, solveTries) => (solved / Math.max(1, solveTries))


const Clamp = (x, min, max) => x > max ? max : (x < min ? min : x)


const StringToDate = (str) => new Date(Date.parse(str)).toLocaleDateString("RO-ro")

const StringToDateTime = (str) => new Date(Date.parse(str)).toLocaleString("RO-ro", {year: "numeric", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit"})

const GetUserPicture = (user) => {
    if(!user || !user.picture) return `${process.env.REACT_APP_HOSTNAME}/images/default.png`

    return user.picture.includes("://")? user.picture : `${process.env.REACT_APP_HOSTNAME}/images/${user.picture}`
}

const LoginWithGoogle = () => {
    const RESPONSE_TYPE = 'code'
    const SCOPE = 'email profile openid'
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
        process.env.REACT_APP_GOOGLE_CLIENT_ID
    )}&redirect_uri=${encodeURIComponent(
        process.env.REACT_APP_REDIRECT_URI
    )}&response_type=${RESPONSE_TYPE}&scope=${encodeURIComponent(SCOPE)}`
    console.log('URL:', authUrl)
    window.location.href = authUrl
}

export default { LoginWithGoogle, GetUserPicture, StringToDateTime, StringToDate, Clamp, CountdownRenderer, GetSolveRating, GetStarsFromRating, ScrollToRuntime, DefaultProfileImage, GetLanguageExtension, GetLoadingResultElement, GetExecutionTimeElement, GetMemString, GetProgressBar }