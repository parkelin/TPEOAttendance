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
                if (!resp.data.admin) {
                    history.push("/");
                } else {
                    setAdmin(true);
                }
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
            }
        }
        loadCredentials();
    }, []);
    async function revokeAdminStatus() {
        const decode = jwtDecode(localStorage.getItem("@token"));
        const res = await fetch("http://localhost:5000/revokeAdmin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ member: decode }),
        });
        console.log("called");
        history.push("/");
    }

    async function logOut() {
        localStorage.clear();
        setUser(null);
        setName("");
        history.push("/login");
    }
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    if (admin) {
        return (
            <Fragment>
                <h1>Hello Admin {name}</h1>
                <button onClick={revokeAdminStatus} className="button">
                    Revoke Admin
                </button>
                <button onClick={logOut} className="button">
                    Log Out
                </button>
            </Fragment>

        );
    } else {
        return (
            <Fragment>
                <h1>Verifying Admin Status...</h1>
            </Fragment>
        )
    }
}