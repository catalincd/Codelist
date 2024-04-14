class CookieManager {

    COOKIE_NAME = "__COOKIE"

    constructor(_cookies) {
        this.cookies = _cookies;
    }

    GetCookies = () => this.cookies.get(this.COOKIE_NAME)

    GetCookie = (name) => this.cookies.get(this.COOKIE_NAME)[name]

    GetUser = () => {
        const { username, email, picture, token, likes } = this.cookies.get(this.COOKIE_NAME)
        return { username, email, picture, token, likes }
    }

    ClearCookies = () => {
        this.cookies.remove(this.COOKIE_NAME)
    }

    SetCookie = (name, obj) => {
        const currentCookies = this.cookies.get(this.COOKIE_NAME)
        currentCookies[name] = obj
        this.cookies.set(this.COOKIE_NAME, currentCookies)
    }
}

export default CookieManager