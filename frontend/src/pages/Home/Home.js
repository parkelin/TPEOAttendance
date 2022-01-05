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
                    body: JSON.stringify({ member: decode }),
                });
                // Get Name from JWT Token
                const resp = await res.json();
                if (resp.data.admin) {
                    history.push("/admin");
                }
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
            }
        }
        loadCredentials();
    }, []);
    async function changeAdminStatus() {
        const decode = jwtDecode(localStorage.getItem("@token"));
        const res = await fetch("http://localhost:5000/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ member: decode }),
        });
        history.push("/admin");
    }
    async function logOut() {
        localStorage.clear();
        setUser(null);
        setName("");
        history.push("/login");
    }
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    return (
        <Fragment>
            <h1>Hey {name}</h1>
            <button onClick={changeAdminStatus} className="button">
                Become admin
            </button>
            <button onClick={logOut} className="button">
                Log Out
            </button>
        </Fragment>

    );
}