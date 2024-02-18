import React, {useContext} from "react"
import Layout from "../components/Layout";

const Home = (props) =>{
  return (
    <div className="mainContainer">
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