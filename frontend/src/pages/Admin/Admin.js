import "./admin.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Collapse from "../../components/Collapse/Collapse.js";
// import rightAccent from './rightAccent.png';
//import ApiCalendar from 'react-google-calendar-api';
//import calendarCredentials from "./apiGoogleconfig.json";
const { default: jwtDecode } = require("jwt-decode");
export default function Admin() {

    const history = useHistory();
    useEffect(() => {
        async function loadCredentials() {
            // If the token doesn't exist, do not log in
            if (!localStorage.getItem("@token")) {
                history.push("/login");
            } else {
                const request = await fetch("http://localhost:5500/auth", {
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                });
                // Get Status
                const status = await request.status;
                // If token is invalid, push to login
                if (status != 200) {
                    history.push("/login");
                }

                const decode = jwtDecode(localStorage.getItem("@token"));
                const res = await fetch("http://localhost:5500/member", {
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
                }
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
                setLoaded(true);
                setMemberType(resp.data.type);
            }
        }
        loadCredentials();
    }, []);

    async function changeMemberType(type) {
        setMemberType(type);
        const res = await fetch("http://localhost:5500/member_type", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ member: user, type: type }),
        });
    }
    async function logOut() {
        localStorage.clear();
        setUser(null);
        setName("");
        history.push("/login");
    }
    const [memberType, setMemberType] = useState("");
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [loaded, setLoaded] = useState(false);

    return loaded ? memberType == "Member" ? <Fragment>
        {/* <img src="/images/accent1.png" className="leftImage"></img>
        <img src='/images/rightAccent.png' className="rightImage"></img> */}
        
        <div className="heading">
            <h1 className="title-text"></h1>
        </div>
        <h2 id="onboarding">Welcome,</h2>
        <h2 id="role">Please select your role:</h2>
        <div id="group">
            <button onClick={() => changeMemberType("Design")} className="available">
                Design
            </button>
            <button onClick={() => changeMemberType("Product")} className="available">
                Product
            </button>
            <button onClick={() => changeMemberType("Engineering")} className="available">
                Engineering
            </button>
        </div>

    </Fragment> : <Fragment>
        <button className="log-out" onClick={logOut}>Log Out</button>
        <h3 className="welcome">Welcome</h3>

        <img src='/images/rightAccent.png' className="rightAccent"></img>

        <div className="adminButtons">
            <button onClick={() => history.push("/admin/member-roster")} className="attendanceButton">
                Member Roster
            </button>
            <button onClick={() => history.push("/admin/meetings")} className="attendanceButton">
                Meetings
            </button>
            <button onClick={() => history.push("/checkin")} className="attendanceButton">
                Check In
            </button>
            <button onClick={() => history.push("/history")} className="attendanceButton">
                History
            </button>
        </div>
    </Fragment> : null;
}