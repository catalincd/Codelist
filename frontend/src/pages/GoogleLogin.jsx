import React from "react"

import { loginWithGoogle } from "../components/GoogleLoginButton"

const GoogleLogin = (props) => {

    return (<div>
        google login
        <button onClick={loginWithGoogle}>LOGIN ME</button>
    </div>)
}

export default GoogleLogin