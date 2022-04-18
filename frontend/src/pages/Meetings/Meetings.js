import "./meetings.css";
import { useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Login from "../../components/Login/Login.js";
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
// import rightImg from './rightImg.png';
import { Select, MenuItem } from '@mui/material';
import Box from '@mui/material/Box';
import Layout from "../../components/Layout/Layout";
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

    async function meetingsList() {
        const meetings_list = await fetch("http://localhost:5500/meetings_list", {
            method: "GET",
            headers: {
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
        });
        const meetings_list_result = await meetings_list.json();
        setMeetings(meetings_list_result.data);
    };

    // async function BasicSelect() {
    //     const [age, setAge] = React.useState('');

    //     const handleChange = (event) => {
    //     setAge(event.target.value);
    // };

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

    // function BasicSelect() {
    //     const [age, setAge] = React.useState('');

    //     const handleChange = (event) => {
    //     setAge(event.target.value);
    // };

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
        if (meetingName == "" || password == "") {
            setSubmissionError(true);
            return;
        }
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
            body: JSON.stringify({ name: meetingName, start: startDate, end: endDate, type: meetingType, password: password }),
        });
        setSubmissionError(false);
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
        { field: 'day', headerName: 'Day', width: 130 },
        { field: 'fStart', headerName: 'Start Date', width: 200 },
        { field: 'fEnd', headerName: 'End Date', width: 200 },
        { field: 'type', headerName: 'Type', width: 130 },
        { field: 'password', headerName: "Password", width: 130 },
    ];

    const [members, setMembers] = useState([]);
    const [meetings, setMeetings] = useState([]);
    const [name, setName] = useState("");
    const [user, setUser] = useState(null);
    const [admin, setAdmin] = useState(false);
    const [meetingName, setMeetingName] = useState("");
    const [password, setPassword] = useState("");
    const [meetingTime, setMeetingTime] = useState(new Date());
    const [meetingDuration, setMeetingDuration] = useState({ hours: 1, minutes: 0, seconds: 0 });
    const [meetingType, setMeetingType] = useState("General");
    const [meetingSelection, setMeetingSelection] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const [submissionError, setSubmissionError] = useState(false);
    const [sortModel, setSortModel] = useState([
        {
            field: 'day',
            sort: 'desc',
        },
    ]);
    if (admin && loaded) {
        return (
            <Layout
                headerTitle="Meetings"
                background={<div className="floatRight">
                    <img src="/images/rightImg.png" class="floatRight"></img>
                </div>}
            >
                <div className="float-container">
                    <div className="float-child">
                        <h3>Input Meeting</h3>
                        <InputLabel id="demo-simple-select-label">Select...</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={10}
                            label="Select"
                        >
                            <MenuItem value={10}>General</MenuItem>
                            <MenuItem value={20}>Engineering</MenuItem>
                            <MenuItem value={30}>Design</MenuItem>
                            <MenuItem value={30}>Product</MenuItem>
                        </Select>

                        <br></br>
                        <br></br>
                        <br></br>
                        <h3>Date/Time</h3>
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
                        {/* <div>
                                <DataGrid
                                    rows={meetings}
                                    columns={columns}
                                    sx={{ fontFamily: "Poppins,sans-serif", fontWeight: 200, fontSize: "70%" }}
                                    checkboxSelection
                                    onSelectionModelChange={(newSelectionModel) => {
                                        setMeetingSelection(newSelectionModel);
                                    }}
                                    selectionModel={meetingSelection}
                                    sortModel={sortModel}
                                    onSortModelChange={(model) => setSortModel(model)}

                                />
                                {meetingSelection.length != 0 && <button onClick={deleteMeetings} className="button">
                                    Delete Meetings
                                </button>}
                            </div> */}

                        <h3>Duration</h3>
                        <select defaultValue={meetingType} onChange={e => setMeetingType(e.target.value)}>
                            <option defaultValue="General">General</option>
                            <option defaultValue="Design">Design</option>
                            <option defaultValue="Engineering">Engineering</option>
                            <option defaultValue="Product">Product</option>
                        </select>
                        <FormControl
                            id="formControlsTextB"
                            type="text"
                            label="Text"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        <button onClick={submitMeeting}>
                            Submit Meeting
                        </button>
                    </div>



                </div>
                {submissionError && <div className="alert">
                    <span className="closebtn" onClick={() => setSubmissionError(false)}>&times;</span>
                    Meeting name and Password can't be blank
                </div>}
            </Layout>

        );
    } else {
        return null;
    }
}