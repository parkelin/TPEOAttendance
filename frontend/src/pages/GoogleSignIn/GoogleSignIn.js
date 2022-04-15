import "./googleSignIn.css";
import LoginLink from "../../components/Login/Login.js";
const { default: jwtDecode } = require("jwt-decode");
export default function GoogleSignIn() {
    return(<div>
        <head>
        <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
        </head>

        <img src="/images/accent1.png" className="leftImg"></img>
        <img src="/images/accent2.png" className="rightImg"></img>
        <div id="signGroup">
        <h1>Log In</h1>
         <LoginLink></LoginLink>
         </div>
        </div>
    );
}