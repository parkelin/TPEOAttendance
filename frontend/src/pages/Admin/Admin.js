import "./style.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Collapse from "../../components/Collapse/Collapse.js";
import Login from "../../components/Login/Login.js";
import DateTime from "../../components/DateTime/DateTime.js";
import DateTimePicker from 'react-datetime-picker';
import DurationPicker from 'react-duration-picker';
import { FormControl } from 'react-bootstrap';
import Modal from 'react-modal';
import moment from "moment";
//import ApiCalendar from 'react-google-calendar-api';
//import calendarCredentials from "./apiGoogleconfig.json";
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
                const meetings_list = await fetch("http://localhost:5000/meetings_list", {
                    method: "GET",
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                });
                const meetings_list_result = await meetings_list.json();
                setMeetings(meetings_list_result.data);
                setLoaded(true);
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
        history.push("/");
    }

    async function logOut() {
        localStorage.clear();
        setUser(null);
        setName("");
        history.push("/login");
    }
    async function meetingsPage() {
        history.push("/admin/meetings");
    }

    const [members, setMembers] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [loaded, setLoaded] = useState(false);
    if (admin && loaded) {
        return (
            <Fragment>
                <h2>Welcome {name}</h2>
                <br></br><br></br>
                <h3>List of TPEO Members</h3>
                <br></br>
                {meetings.length > 0 && <ul>
                    {members.map((member, index) => <Collapse key={index} name={member.name} id={member.id} meetings={meetings}/>)}
                </ul>}
                <button onClick={revokeAdminStatus} className="button">
                    Revoke Admin
                </button>
                <button onClick={logOut} className="button">
                    Log Out
                </button>
                <button onClick={meetingsPage} className="button">
                    Meetings Page
                </button>
            </Fragment>

        );
    }else{
        return null;
    }
}