const ErrorLogger = (error) => console.error("Error fetching", error)
const CallbackLogger = (data) => console.log("Received data:", data)


const Fetch = ({ url, method, headers = {}, body = "", callback = CallbackLogger, errorCallback = ErrorLogger }) => {
    try {
        fetch(url, { method, headers, body }).then(response => response.json()).then(data => callback(data)).catch(error => errorCallback(error))
    }
    catch (error) {
        errorCallback(error)
    }
}

const GetUserData = () => {

}

export default {  }