import React, {useContext, useState, useEffect} from "react"
import Title from 'reactjs-title'
import { UserContext } from "../utils/UserContext";
import Layout from "../components/Layout";

const Login = (props) => {

  const { user, setUser } = useContext(UserContext);

  return (
    <div className="mainContainer">
      <Title render="Codelist - Login" />
      <Layout>
        <button onClick={() => { setUser({ username: "coxman", rights: "none" }) }}>Log me in!</button>
      </Layout>
    </div>
  );
}
export default Login;