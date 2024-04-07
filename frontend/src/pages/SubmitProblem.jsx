import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Problem from "../components/Problem";
import ProblemSubmitElement from "../components/ProblemSubmitElement";

import { UserContext } from "../utils/UserContext";

const SubmitProblems = (props) => {

    const { user, setUser } = useContext(UserContext);

    return (
        <div className="mainContainer">
            <Layout>
                <div className="problemsPageContainer">
                    <ProblemSubmitElement />
                    {problemList.map(problem => <Problem id={problem.id}/>)}
                </div>
            </Layout>
        </div>
    );
}

export default SubmitProblems;