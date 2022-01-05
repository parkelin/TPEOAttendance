import "./style.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Login from "../../components/Login/Login.js";
const { default: jwtDecode } = require("jwt-decode");
export default function Home() {

    const history = useHistory();
    useEffect(() => {
        async function loadCredentials() {
            // If the token doesn't exist, do not log in
            if (!localStorage.getItem("@token")) {
                history.push("/login");
            } else {

                console.log(localStorage.getItem("@token"));
                const request = await fetch("http://localhost:5000/auth", {
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                });
                // Get Status
                const status = await request.status;
                console.log(status);
                // If token is invalid, push to login
                if (status != 200) {
                    history.push("/login");
                }

                const decode = jwtDecode(localStorage.getItem("@token"));
                const res = await fetch("http://localhost:5000/member", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                    body: JSON.stringify({member: decode}),
                });
                // Get Name from JWT Token

                setName(decode.name);
            }
        }
        loadCredentials();
    }, []);
    const [name, setName] = useState("");
    return (
        <Fragment>
            <h1>Hey {name}</h1>
        </Fragment>
    );
}