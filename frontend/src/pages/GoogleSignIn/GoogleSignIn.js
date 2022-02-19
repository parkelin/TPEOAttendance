import "./style.css";
import image1 from './accent1.png';
import image2 from './accent2.png';
import LoginLink from "../../components/Login/Login.js";
const { default: jwtDecode } = require("jwt-decode");
export default function GoogleSignIn() {
    return(<div>
            <img src={image1} className="leftImg"></img>
            <img src={image2} className="rightImg"></img>

            <h1>Log In</h1>
            <LoginLink></LoginLink>
            </div>
    );
}