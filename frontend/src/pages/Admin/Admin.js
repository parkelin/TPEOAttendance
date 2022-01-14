import "./style.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Login from "../../components/Login/Login.js";
import DateTime from "../../components/DateTime/DateTime.js";
import { FormControl } from 'react-bootstrap';
import moment from "moment";
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
                const members_list = await fetch("http://localhost:5000/members_list", {
                    method: "GET",
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                });
                const members_list_result = await members_list.json();
                setMembers(members_list_result.data);
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

    async function submitMeeting() {
        console.log(meetingName);
        console.log(startDate);
        console.log(endDate);
        const res = await fetch("http://localhost:5000/meeting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({name: meetingName, start: startDate, end: endDate}),
        });
        setMeetingName("");
    }
    async function setMeetingTime(start, end) {
        console.log("called");
        setStartDate(start);
        setEndDate(end);
    }
    const [members, setMembers] = useState([]);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [meetingName, setMeetingName] = useState("");
    const [startDate, setStartDate] = useState(moment());
    const [endDate, setEndDate] = useState(moment());
    if (admin) {
        return (
            <Fragment>
                <h1>Hello Admin {name}</h1>
                <br></br><br></br>
                <h3>List of TPEO Members</h3>
                <br></br>
                <ul id="Admin">
                    {members.map((member, index) => <li key={index}>Name: {member.name} &emsp; Admin: {member.admin.toString()}</li>)}
                </ul>
                <h3>Input meeting:</h3>
                <FormControl
                    id="formControlsTextB"
                    type="text"
                    label="Text"
                    placeholder="Meeting name"
                    value={meetingName}
                    onChange={e => setMeetingName(e.target.value)}
                />
                <DateTime onChange={e =>
                    setMeetingTime(e.target.start,e.target.end)
                } />
                <button onClick={submitMeeting} className="button">
                    Submit Meeting
                </button>
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