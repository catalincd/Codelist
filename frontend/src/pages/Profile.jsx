import React, { useContext, useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useParams } from "react-router"

import Title from 'reactjs-title'
import Requests from "../utils/Requests"
import Cookies from 'universal-cookie'

import { UserContext } from "../utils/UserContext";
import Layout from "../components/Layout";
import IconButton from '../components/IconButton';
import RatingElement from '../components/RatingElement';
import UploadedElement from '../components/UploadedElement';

import { FaUpload } from "react-icons/fa";
import { TiDeleteOutline } from "react-icons/ti";


const Profile = (props) => {

    const { user, setUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('')
    const [success, setSuccess] = useState(false)
    const [pictureName, setPictureName] = useState(`${process.env.REACT_APP_HOSTNAME}/images/default.png`);
    const [userData, setUserData] = useState(null);
    
    const [solvedProblems, setSolvedProblems] = useState([])
    const [uploadedProblems, setUploadedProblems] = useState([])

    const [readArticles, setReadArticles] = useState([])
    const [uploadedArticles, setUploadedArticles] = useState([])

    const imageInputRef = useRef(null)
    const imageFormRef = useRef(null)
    const { name } = useParams();
    document.title = `Codelist - ${name}`

    const editable = user ? (user.username == name) : false

    const cookies = new Cookies(null, { path: '/', sameSite: "strict", expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }) // one week later


    useEffect(() => {
        const fetchUserData = async () => {
            fetch(`${process.env.REACT_APP_HOSTNAME}/api/data/user/full/${name}`,
                {
                    method: "GET"
                })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        console.log(data.error)
                        setErrorMessage(data.error)
                        return
                    }

                    setSolvedProblems([...data.solvedProblems, ...data.solvedProblems, ...data.solvedProblems])
                    setUploadedProblems(data.uploadedProblems)
                    setUserData(data)
                    setPictureName(`${process.env.REACT_APP_HOSTNAME}/images/${data.picture}`)
                    console.log(data)
                })
                .catch(error => console.error(error));

            console.log("FETCHED FROM PROBLEM")
        }
        fetchUserData()
    }, [])

    const onLogout = () => {
        cookies.remove("USER_COOKIE")
        user && setUser(null)
        window.location.reload()
    }

    const onResetProfilePicture = async () => {
        //cookies.set("USER_COOKIE", JSON.parse({ ...user, picture: "default.png" }))

        setPictureName(`${process.env.REACT_APP_HOSTNAME}/images/default.png`)
        setUser({ ...user, picture: "default.png" })

        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/resetpicture`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token }
            })
    }

    const onResetPassword = async () => {
        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/sendpasswordreset`,
            {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Authorization': user.token },
                body: JSON.stringify({
                    email: user.email
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    setErrorMessage(data.error)
                    return
                }

                setSuccess(data.message == "PASSWORD_RESET_SENT_SUCCESS")
            })
            .catch(error => console.error(error));
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        var data = new FormData()
        data.append("profilePicture", e.target[0].files[0])


        fetch(`${process.env.REACT_APP_HOSTNAME}/api/auth/newpicture`,
            {
                method: "PUT",
                headers: { 'Authorization': user.token },
                body: data
            })

        e.preventDefault()
    }

    const onUploadProfilePicture = async () => {
        imageInputRef && imageInputRef.current.click()
    }

    const onUploadProfilePictureButton = async (file) => {
        const pictureName = `${user.username}.${file.name.split(".").splice(-1)}`
        setUser({ ...user, picture: pictureName })

        //cookies.set("USER_COOKIE", JSON.parse({ ...user, picture: pictureName }))

        setPictureName(URL.createObjectURL(file));
        imageFormRef.current.click()
    }


    const editableImage = (
        <div className="profilePicture editablePicture">
            <div className="pictureControls">
                <button className="upload" onClick={() => onUploadProfilePicture()}><FaUpload /></button>
                <button className="remove" onClick={() => onResetProfilePicture()}><TiDeleteOutline /></button>
            </div>
            <img src={pictureName} />
            <form onSubmit={handleSubmit}>
                <input
                    ref={imageInputRef}
                    type="file"
                    name="profilePicture"
                    onChange={(event) => {
                        onUploadProfilePictureButton(event.target.files[0])
                    }}
                />
                <input
                    type="text"
                    name="userToken"
                    value={user ? user.token : ""}
                    readOnly
                />
                <button ref={imageFormRef} type="submit">submit</button>
            </form>

        </div>
    )

    const normalImage = (
        <div className="profilePicture">
            <img src={pictureName} />
        </div>
    )

    const accountButtons = (
        <div className="accountButtons">
            <IconButton text="Log out" icon="logout" onClickHandle={() => onLogout()} reverse={true} />
            <IconButton text="Reset password" icon="password" onClickHandle={() => onResetPassword()} reverse={true} />
        </div>
    )


    return (
        <div className="mainContainer">
            <Layout error={errorMessage} setError={setErrorMessage}>
                {
                    userData &&
                    <div className="profilePageContainer tile pageFiller">
                        <div className="profileTop">
                            {
                                editable ? editableImage : normalImage
                            }
                            <div className="profileDetails">
                                <h3>{userData.username}</h3>
                                <p>{userData.description}</p>
                                <p>Joined Codelist: {new Date(Date.parse(userData.created)).toLocaleDateString("RO-ro")}</p>
                            </div>
                            {
                                editable && accountButtons
                            }
                        </div>
                        {
                            uploadedProblems && uploadedProblems.length > 0 &&
                            <div className="profileProblems">
                                <div className="problemsTitle">
                                    <h3>Probleme încărcate</h3>
                                </div>
                                <div className="problemContainers">
                                    <div className="uploadedProblems">
                                        {
                                            uploadedProblems.map(problem => <UploadedElement key={problem.id} id={problem.id} name={problem.name} views={problem.views} link={`/problem/${problem.id}`} />)
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            solvedProblems && solvedProblems.length > 0 &&
                            <div className="profileProblems">
                                <div className="problemsTitle">
                                    <h3>Probleme rezolvate</h3>
                                </div>
                                <div className="problemContainers">
                                    <div className="solvedProblems">
                                        {
                                            solvedProblems.map(problem => <RatingElement key={problem.id} id={problem.id} name={problem.name} rating={problem.rating} solved={problem.solved} link={`/problem/${problem.id}`}/>)
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            uploadedArticles && uploadedArticles.length > 0 &&
                            <div className="profileProblems">
                                <div className="problemsTitle">
                                    <h3>Articole încărcate</h3>
                                </div>
                                <div className="problemContainers">
                                    <div className="uploadedProblems">
                                        {
                                            uploadedArticles.map(article => <UploadedElement key={article.id} id={article.id} name={article.name} views={article.views} link={`/article?id=${article.id}`} />)
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {
                            readArticles && readArticles.length > 0 &&
                            <div className="profileProblems">
                                <div className="problemsTitle">
                                    <h3>Articole citite</h3>
                                </div>
                                <div className="problemContainers">
                                    <div className="solvedProblems">
                                        {
                                            readArticles.map(article => <RatingElement key={article.id} id={article.id} name={article.name} rating={article.rating} solved={article.solved} link={`/article?id=${article.id}`}/>)
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                    </div>




                }
                {
                    !userData && errorMessage &&
                    <div className="tile pageFiller profilePageContainer errorContainer">
                        <p>{errorMessage}</p>
                    </div>
                }
            </Layout>
        </div>
    );
}
export default Profile;