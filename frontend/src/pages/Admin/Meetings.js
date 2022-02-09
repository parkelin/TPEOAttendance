import "./style.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Login from "../../components/Login/Login.js";
import DateTime from "../../components/DateTime/DateTime.js";
import DurationPicker from 'react-duration-picker';
import { FormControl } from 'react-bootstrap';
import Modal from 'react-modal';
import moment from "moment";
import { DataGrid } from '@mui/x-data-grid';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
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
                
            }
        }
        loadCredentials();
    }, []);

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
    async function mainPage() {
        history.push("/admin");
    }
    async function submitMeeting() {
        const startDate = meetingTime;
        const endDate = new Date(startDate.getTime());
        endDate.setHours(startDate.getHours() + meetingDuration.hours);
        endDate.setMinutes(startDate.getMinutes() + meetingDuration.minutes);
        endDate.setSeconds(startDate.getSeconds() + meetingDuration.seconds);
        const res = await fetch("http://localhost:5500/meeting", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ name: meetingName, start: startDate, end: endDate, type: meetingType }),
        });
        meetingsList();
    }

    async function deleteMeetings() {
        const res = await fetch("http://localhost:5500/delete_meetings", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ meetings: meetingSelection }),
        });
        setMeetingSelection([]);
        meetingsList();
    }
    const columns = [
        { field: 'name', headerName: 'Meeting Name', width: 130 },
        { field: 'day', headerName: 'Day', width: 130},
        { field: 'fStart', headerName: 'Start Date', width: 200 },
        { field: 'fEnd', headerName: 'End Date', width: 200 },
        { field: 'type', headerName: 'Meeting Type', width: 130 },
    ];

    const [members, setMembers] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [meetingName, setMeetingName] = useState("");
    const [meetingTime, setMeetingTime] = useState(new Date());
    const [meetingDuration, setMeetingDuration] = useState({ hours: 1, minutes: 0, seconds: 0 });
    const [meetingType, setMeetingType] = useState("General");
    const [meetingSelection, setMeetingSelection] = useState([]);
    const [sortModel, setSortModel] = useState([
        {
          field: 'day',
          sort: 'desc',
        },
      ]);
    if (admin) {
        return (
            <Fragment>
                <h1>Hello Admin {name}</h1>
                <br></br><br></br>
                <h3>Input meeting:</h3>
                <FormControl
                    id="formControlsTextB"
                    type="text"
                    label="Text"
                    placeholder="Meeting name"
                    value={meetingName}
                    onChange={e => setMeetingName(e.target.value)}
                />
                <br></br>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        renderInput={(props) => <TextField {...props} />}
                        label="Date and Time"
                        value={meetingTime}
                        onChange={(newMeetingTime) => {
                            setMeetingTime(newMeetingTime);
                        }}
                    />
                </LocalizationProvider>
                <h3>Input duration:</h3>
                {<DurationPicker
                    
                    onChange={e => setMeetingDuration(e)}
                    initialDuration={{ hours: 1, minutes: 0, seconds: 0 }}
                    maxHours={24}

                />}
                <select defaultValue={meetingType} onChange={e => setMeetingType(e.target.value)}>
                    <option defaultValue="General">General</option>
                    <option defaultValue="Design">Design</option>
                    <option defaultValue="Engineering">Engineering</option>
                    <option defaultValue="Product">Product</option>
                </select>
                <button onClick={submitMeeting} className="button">
                    Submit Meeting
                </button>
                <h3>List of TPEO Meetings</h3>
                <br></br>
                <div style={{ height: 400, width: "100%"}}>
                    <DataGrid
                        rows={meetings}
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
                <button onClick={deleteMeetings} className="button">
                    Delete Meetings
                </button>

                <button onClick={revokeAdminStatus} className="button">
                    Revoke Admin
                </button>
                <button onClick={logOut} className="button">
                    Log Out
                </button>
                <button onClick={mainPage} className="button">
                    Main Page
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