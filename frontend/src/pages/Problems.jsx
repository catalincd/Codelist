import React, { useContext, useState, useEffect } from "react"
import Layout from "../components/Layout";
import Problem from "../components/Problem";

import { UserContext } from "../utils/UserContext";

const Problems = (props) => {

    const { user, setUser } = useContext(UserContext);

    return (
        <div className="mainContainer">
            <Layout>
                <Problem id="1" />
                <Problem id="2" />
                <Problem id="2" />
            </Layout>
        </div>
    );
}

export default Problems;