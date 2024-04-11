import React from 'react';
import { Link } from 'react-router-dom';



const UploadedElement = ({ name, id, views, link }) => {


    return (
        <Link to={link} className="uploadElement">
            <p>{name} #{id}</p>
            <div className="viewsContainer">
                <p>{views} <span className="material-symbols-outlined problem-icon">visibility</span></p>
            </div>
        </Link>
    )
}

export default UploadedElement