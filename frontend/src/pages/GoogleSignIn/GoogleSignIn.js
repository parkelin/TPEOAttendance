import "./googleSignIn.css";
import LoginLink from "../../components/Login/Login.js";
import Layout from "../../components/Layout/Layout";
const { default: jwtDecode } = require("jwt-decode");
export default function GoogleSignIn() {
    return (
        <Layout
            noHeader
            background={<>
                <img src="/images/accent1.png" className="leftImg"></img>
                <img src="/images/accent2.png" className="rightImg"></img>
            </>}
        >
            <div className="signInGroup">
                <h1>Log In</h1>
                <LoginLink></LoginLink>
            </div>
        </Layout>
    );
}