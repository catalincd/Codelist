import React, {useContext} from "react"
import Title from 'reactjs-title'
import Layout from "../components/Layout";

const Home = (props) =>{
  return (
    <div className="mainContainer">
        <Title render="Codelist - Home"/>
        <Layout>
          <div className="tile">
            <p>1</p>
          </div>
          <div className="tile">
            <p>2</p>
          </div>
          <div className="tile">
            <p>3</p>
          </div>
        </Layout>
    </div>
  );
}
export default Home;