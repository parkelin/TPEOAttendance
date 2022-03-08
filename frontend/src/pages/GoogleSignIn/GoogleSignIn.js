import "./style.css";
import image1 from './accent1.png';
import image2 from './accent2.png';
import LoginLink from "../../components/Login/Login.js";
const { default: jwtDecode } = require("jwt-decode");
export default function GoogleSignIn() {
    return(<div>
        <head>
        <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
        </head>

        <img src={image1} className="leftImg"></img>
        <img src={image2} className="rightImg"></img>
        <div id="signGroup">
        <h1>Log In</h1>
         <LoginLink></LoginLink>
         </div>
        </div>
    );
}