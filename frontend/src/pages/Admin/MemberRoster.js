import "./style.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Collapse from "../../components/Collapse/Collapse.js";
import previousButton from './Arrow.svg';
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
export default function MemberRoster() {

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
                } else {

                    setAdmin(true);
                }
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
                const members_list = await fetch("http://localhost:5500/members_list", {
                    method: "GET",
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                });
                const members_list_result = await members_list.json();
                setMembers(members_list_result.data);
                const meetings_list = await fetch("http://localhost:5500/meetings_list", {
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
        const res = await fetch("http://localhost:5500/revokeAdmin", {
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
    function changeFilter(type) {
        if (type == filter) {
            setFilter("");
        } else {
            setFilter(type);
        }
    }
    const [filter, setFilter] = useState("");
    const [members, setMembers] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [loaded, setLoaded] = useState(false);
    if (admin && loaded) {
        return (

            <Fragment>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
                {/* Changed Welcome [name] -> Member Roster */}
                <div id="wrapper">
                    <div id="heading">
                        <button className="backArrow"><img src={previousButton} onClick={() => history.push("/admin")} /></button>
                        <h2>Member Roster</h2>
                    </div>
                    <div id="filter">
                        <button className="unclickable">Sort by: </button>
                        <button style={(filter == "Engineering" ? { backgroundColor: "rgba(218, 233, 251, 0.45)", color: "#8BBEF9" } : {})} onClick={() => changeFilter("Engineering")}>Engineering</button>
                        <button style={(filter == "Product" ? { backgroundColor: "#F9F2FF", color: "#C175FF" } : {})} onClick={() => changeFilter("Product")}>Product</button>
                        <button style={(filter == "Design" ? { backgroundColor: "rgba(203, 233, 233, 0.47)", color: "#75D0D0" } : {})} onClick={() => changeFilter("Design")}>Design</button>
                        <button style={(filter == "Executive" ? { backgroundColor: "#FFF2E1", color: "#EBA23B" } : {})} onClick={() => changeFilter("Executive")}>Exec Team</button>
                    </div>
                    {meetings.length > 0 && <ul>
                        {members.map((member, index) => (filter == "" || filter == member.type || (filter == "Executive" && member.admin)) ? <Collapse key={index} name={member.name} type={member.type} id={member.id} admin={member.admin} meetings={meetings} /> : null)}
                    </ul>}
                    <button onClick={logOut} className="button">
                        Log Out
                    </button>
                    <button onClick={meetingsPage} className="button">
                        Meetings Page
                    </button>
                </div>
            </Fragment>

        );
    } else {
        return null;
    }
}