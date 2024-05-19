import Cookies from 'universal-cookie'

const ErrorLogger = (error) => console.error("Error fetching", error)
const CallbackLogger = (data) => console.log("Received data:", data)



const FetchRunRequest = async (user, files, language, setError, setData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/run`,
            {
                method: "PUT",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    username: user.username,
                    source: [...files],
                    language
                })
            })

        if (!response.ok) {
            setError("ERROR REQ FAILED")
            return
        }

        const data = await response.json()
        setData(data)
    }
    catch (error) {
        setError(error)
    }
}

const FetchSubmitQuizProblemRequest = async (user, files, language, quizData, stepId, setError, setData) => {
    try {
        const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/solutions/sendquiz`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    quizId: quizData.id,
                    stepId,
                    username: user.username,
                    source: [...files],
                    language,
                    token: quizData.token,
                    solutionId: quizData.solutionId
                })
            })

        if (!response.ok) {
            setError("ERROR REQ FAILED")
            return
        }

        const data = await response.json()
        setData(data)
    }
    catch (error) {
        setError(error)
    }
}


const LoginFromCookie = async (setUserHook) => {
    const cookies = new Cookies(null, { path: '/', sameSite: "strict", expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // one week later
    const token = cookies.get("USER_COOKIE")

    if(!token) return null

    const data = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/token`,
    {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({token})
    })

    const body = await data.json()

    console.log(token)
    console.log(body)

    setUserHook(body)
} 


const FetchDataPost = async (req_data, setData, setError) => { //setError
    try {
        const response = await fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/google`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(req_data)
            })

        if (!response.ok) {
            setError("ERROR REQ FAILED")
            return
        }

        const data = await response.json()
        setData(data)
    }
    catch (error) {
        setError(error)
    }
}

export default { FetchDataPost, LoginFromCookie, FetchRunRequest, FetchSubmitQuizProblemRequest}