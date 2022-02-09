import "./style.css";
import React, { useEffect, useState, useRef, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Login from "../../components/Login/Login.js";
import { DataGrid } from '@mui/x-data-grid';
const { default: jwtDecode } = require("jwt-decode");
export default function Home() {

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
                console.log(status);
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
                if (resp.data.admin) {
                    history.push("/admin");
                }
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
                setUserInfo(resp.data);
                const meetings_list = await fetch("http://localhost:5500/meetings_list", {
                    method: "GET",
                    headers: {
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                });
                const meetings_list_result = await meetings_list.json();
                setMeetings(meetings_list_result.data);

                const attendance_list = await fetch("http://localhost:5500/attendance_list", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: "Bearer " + localStorage.getItem("@token"),
                    },
                    body: JSON.stringify({ id: decode.user_id }),
                });
                const attendance_list_result = await attendance_list.json();
                const temp = [];
                let tempScore = 0;
                for (let i = 0; i < meetings_list_result.data.length; i++) {
                    const attendance = attendance_list_result.data[i];
                    var tempJ = JSON.parse(JSON.stringify(meetings_list_result.data[i]));
                    tempJ["attendance"] = attendance;
                    if (attendance == 'Late') {
                        tempScore += 0.5;
                    } else if (attendance == 'Absent') {
                        tempScore += 1;
                    }
                    temp.push(tempJ);
                }
                setScore(tempScore);
                setAttendance(attendance_list_result.data);
                setMeetingsWithAttendance(temp);
            }
        }

        loadCredentials();
    }, []);

    function renderAttendance(params) {
        let color = 'black';
        let backgroundColor = 'black';
        if(params.value=="Present"){
            color = "#6EC47F";
            backgroundColor = "#CBE9D1";
        }else if(params.value=="Absent"){
            color = "#bb4244";
            backgroundColor = "#efcece";
        }else if(params.value=="Excused"){
            color = "#64A9F7";
            backgroundColor = "#C5E0FF";
        }else{
            color = "#EF7357";
            backgroundColor = "#FDEAE5";
        }
        return <button id="button" style={{fontFamily: "Poppins,sans-serif", fontWeight: 600, color: color, backgroundColor: backgroundColor, border: "none", padding: "3px", borderRadius: "10px"}}>{params.value}</button>;
    }

    async function meetingsList() {
        const meetings_list = await fetch("http://localhost:5500/meetings_list", {
            method: "GET",
            headers: {
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
        });
        const meetings_list_result = await meetings_list.json();
        setMeetings(meetings_list_result.data);
    }

    function useInterval(callback, delay) {
        const savedCallback = useRef();

        // Remember the latest callback.
        useEffect(() => {
            savedCallback.current = callback;
        }, [callback]);

        // Set up the interval.
        useEffect(() => {
            function tick() {
                savedCallback.current();
            }
            if (delay !== null) {
                let id = setInterval(tick, delay);
                return () => clearInterval(id);
            }
        }, [delay]);
    }



    useInterval(() => {
        // Your custom logic here
        setDate(Math.round(Date.now() / 1000));
    }, 1000);


    async function changeAdminStatus() {
        const decode = jwtDecode(localStorage.getItem("@token"));
        const res = await fetch("http://localhost:5500/admin", {
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

    async function getAttendance() {
        console.log("CALLED");
        console.log(meetings.length);
        const decode = jwtDecode(localStorage.getItem("@token"));
        const attendance_list = await fetch("http://localhost:5500/attendance_list", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ id: decode.user_id }),
        });
        const attendance_list_result = await attendance_list.json();
        const temp = [];
        let tempScore = 0;
        for (let i = 0; i < meetings.length; i++) {
            const attendance = attendance_list_result.data[i];
            var tempJ = JSON.parse(JSON.stringify(meetings[i]));
            tempJ["attendance"] = attendance;
            if (attendance == 'Late') {
                tempScore += 0.5;
            } else if (attendance == 'Absent') {
                tempScore += 1;
            }
            temp.push(tempJ);
        }
        setScore(tempScore);
        setAttendance(attendance_list_result.data);
        setMeetingsWithAttendance(temp);
    }
    async function user_info() {
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
        setUserInfo(resp.data);
        getAttendance();
    }
    async function signIn(meeting) {
        const decode = jwtDecode(localStorage.getItem("@token"));
        const late = date - Math.round(Date.parse(meeting.start) / 1000) > 600;
        const res = await fetch("http://localhost:5500/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ member: decode, late: late, meeting: meeting }),
        });
        user_info();
    }
    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [name, setName] = useState("");
    const [date, setDate] = useState(Math.round(Date.now() / 1000));
    const [meetings, setMeetings] = useState([]);
    const [meetingsWithAttendance, setMeetingsWithAttendance] = useState([]);
    const [score, setScore] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [meetingSelection, setMeetingSelection] = useState([]);
    const columns = [
        { field: 'name', headerName: 'Meeting Name', width: 130 },
        { field: 'day', headerName: 'Day', width: 130 },
        { field: 'type', headerName: 'Meeting Type', width: 130 },
        { field: 'attendance', headerName: 'Attendance', width: 130, renderCell: renderAttendance},
    ];
    const [sortModel, setSortModel] = useState([
        {
            field: 'day',
            sort: 'desc',
        },
    ]);
    return (
        <Fragment>
            <h1>Hey {name}</h1>
            <button onClick={changeAdminStatus} className="button">
                Become Admin
            </button>
            <ul>
                {meetings.map((meeting, index) => (!userInfo.hasOwnProperty(meeting.id) && date >= Math.round(Date.parse(meeting.start) / 1000) && date < Math.round(Date.parse(meeting.end) / 1000)) ? <button key={index} className="button" onClick={() => signIn(meeting)}>{meeting.name} {Math.floor(((Date.parse(meeting.end) / 1000) - date) / 60)}m {Math.floor(((Date.parse(meeting.end) / 1000) - date) % 60)}s</button> : <area key={index}></area>)}
            </ul>
            <h1>Score: {score}</h1>
            {(score >= 4) ? (score >= 5) ? <h1>Terminated</h1> : <h1>Probation</h1> : <h1>Good Standing</h1>}
            <div style={{ height: 600, width: "100%" }}>
                <DataGrid
                    rows={meetingsWithAttendance}
                    columns={columns}
                    checkboxSelection
                    onSelectionModelChange={(newSelectionModel) => {
                        setMeetingSelection(newSelectionModel);
                    }}
                    selectionModel={meetingSelection}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                />
            </div>
            <button onClick={logOut} className="button">
                Log Out
            </button>
        </Fragment>
    );
}