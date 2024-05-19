const fs = require('fs')
const axios = require('axios')

const User = require('../../schemas/User')
const ConfigManager = require('../../utils/ConfigManager')

const debug = parseInt(fs.readFileSync('./server/keys/debug').toString()) == 1 || false
const protocol = debug? 'http' : 'https'
const domain = fs.readFileSync('./server/hostname').toString() || "codelist.ro"

const GOOGLE_CLIENT = fs.readFileSync('/keys/client').toString()
const GOOGLE_KEY = fs.readFileSync('/keys/google').toString()


const PostGoogleCode = async (code) => {
    const { data } = await axios({
        url: `https://oauth2.googleapis.com/token`,
        method: 'post',
        data: {
            client_id: GOOGLE_CLIENT,
            client_secret: GOOGLE_KEY,
            redirect_uri: `${protocol}://${domain}/callback`,
            grant_type: 'authorization_code',
            code,
        },
    })
    return data
}

const GetUserData = async (code) => {
    const { access_token } = await PostGoogleCode(code)

    const { data } = await axios({
        url: 'https://www.googleapis.com/oauth2/v2/userinfo',
        method: 'get',
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    })

    return data
}

const FetchNewUser = async (data) => {
    console.log("NEW USER")
    console.log(data)

    var currentName = data.name.split(" ").join("_").toLowerCase()
    var currentConcatId = "" + data.id
    var searchedUserByName = await User.findOne({username: currentName})
    while(searchedUserByName)
    {
        console.log(searchedUserByName)
        currentName = currentName.concat(currentConcatId[0])
        currentConcatId = currentConcatId.substring(1)
        searchedUserByName = User.findOne({username: currentName})
    }
    console.log("NAME: " + currentName)

    const id = await ConfigManager.GetNewUserId()
    const user = new User({ id, username: currentName, email: data.email, googleid: data.id, password: "-", description: `Codelist user #${id}`, picture: data.picture, activated: true })
    await user.save()

    console.log(user.toObject())

    return user
}

const DownloadPicture = async (url, path) => {
    const writer = fs.createWriteStream(path);

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
    });

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}



module.exports = { FetchNewUser, PostGoogleCode, GetUserData }