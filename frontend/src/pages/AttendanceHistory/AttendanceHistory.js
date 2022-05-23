import "./attendancehistory.css";
import React, { useEffect, useState, useRef, Fragment } from "react";
import { useHistory } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Layout from "../../components/Layout/Layout";
import { VictoryPie } from 'victory';

const { default: jwtDecode } = require("jwt-decode");
export default function AttendanceHistory() {
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
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
                setUserInfo(resp.data);
                setMemberType(resp.data.type);
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
                const attendanceList = [];
                let tempScore = 0;
                let tempRoleScore = 0;
                for (let i = 0; i < meetings_list_result.data.length; i++) {
                    const attendance = attendance_list_result.data[i][0];
                    const type = attendance_list_result.data[i][1];
                    var tempJ = JSON.parse(JSON.stringify(meetings_list_result.data[i]));
                    tempJ["attendance"] = attendance;
                    if (attendance == 'Late') {
                        if (type == resp.data.type) {
                            tempRoleScore += 0.5;
                        } else if (type == "General") {
                            tempScore += 0.5;
                        }
                    } else if (attendance == 'Absent') {
                        if (type == resp.data.type) {
                            tempRoleScore += 1;
                        } else if (type == "General") {
                            tempScore += 1;
                        }
                    }
                    attendanceList.push(attendance);
                    temp.push(tempJ);
                }
                setGeneralScore(tempScore);
                setRoleScore(tempRoleScore);
                setAttendance(attendanceList);
                setMeetingsWithAttendance(temp);
                setLoaded(true);
            }
        }

        loadCredentials();
    }, []);

    function renderAttendance(params) {
        let color = 'black';
        let backgroundColor = 'black';
        if (params.value == "Present") {
            color = "#6EC47F";
            backgroundColor = "#CBE9D1";
        } else if (params.value == "Absent") {
            color = "#EF7357";
            backgroundColor = "#FDEAE5";
        } else if (params.value == "Excused") {
            color = "#64A9F7";
            backgroundColor = "#C5E0FF";
        } else {
            color = "#D39800";
            backgroundColor = "#FCEFCC";
        }
        return <button id="button" style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, color: color, backgroundColor: backgroundColor, border: "none", padding: "3px", borderRadius: "10px" }}>{params.value}</button>;
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

    async function getAttendance(mType) {
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
        const attendanceList = [];
        let tempScore = 0;
        let tempRoleScore = 0;
        for (let i = 0; i < meetings.length; i++) {
            const attendance = attendance_list_result.data[i][0];
            const type = attendance_list_result.data[i][1];
            var tempJ = JSON.parse(JSON.stringify(meetings[i]));
            tempJ["attendance"] = attendance;
            if (attendance == 'Late') {
                if (type == mType) {
                    tempRoleScore += 0.5;
                } else if (type == "General") {
                    tempScore += 0.5;
                }
            } else if (attendance == 'Absent') {
                if (type == mType) {
                    tempRoleScore += 1;
                } else if (type == "General") {
                    tempScore += 1;
                }
            }
            attendanceList.push(attendance);
            temp.push(tempJ);
        }
        setGeneralScore(tempScore);
        setRoleScore(tempRoleScore);
        setAttendance(attendanceList);
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
        getAttendance(memberType);
    }

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

        getAttendance(type);
    }
    async function checkInPage() {
        history.push("/checkin")
    }

    const [user, setUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [name, setName] = useState("");
    const [meetings, setMeetings] = useState([]);
    const [meetingsWithAttendance, setMeetingsWithAttendance] = useState([]);
    const [generalScore, setGeneralScore] = useState(0);
    const [roleScore, setRoleScore] = useState(0);
    const [attendance, setAttendance] = useState([]);
    const [memberType, setMemberType] = useState("Member");
    const [loaded, setLoaded] = useState(false);

    <style>
@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
</style>

    const columns = [
        { field: 'name', headerName: 'Meeting', width: "600", fontFamily: "Poppins"},
        { field: 'day', headerName: 'Day', width: "300", fontFamily: 'Poppins,sans-serif'  },
        { field: 'type', headerName: 'Meeting Type', width: "400", fontFamily: 'Poppins,sans-serif' },
        { field: 'attendance', headerName: 'Attendance', width: "300", fontFamily: 'Poppins,sans-serif', renderCell: renderAttendance },
    ];

    const [sortModel, setSortModel] = useState([
        {
            field: 'day',
            sort: 'desc',
        },
    ]);
    return !loaded ? null : (
            <><Layout
            headerFixed
            headerTitle="Attendance History"
        >
            {/* <img src='/images/dmCard.png' className="dmCard"></img> */}

            <div className="component">
                <div className="shell1"> 
                    <div className="shellChart1">
                        <VictoryPie
                            data={[{ x: 1, y: 35 }]}
                            /*data={[
                                { x: 1, y: meetingsMissed, label: "a" }
                                { x: 2, y: 5 - meetingsMissed, label: "b" }
                            ]}*/
                            width={200}
                            height={150}
                            innerRadius={20}
                            style={{ labels: { fontSize: 0} }}
                        />
                    </div>
                </div>

                <div className="shell2">
                    <div className="shellChart2">
                        <VictoryPie
                            data={[{ x: 1, y: 35 }]}
                            /*data={[
                                { x: 1, y: meetingsMissed, label: "a" }
                                { x: 2, y: 5 - meetingsMissed, label: "b" }
                            ]}*/
                            width={200}
                            height={150}
                            innerRadius={20}
                            style={{ labels: { fontSize: 0} }}
                        />
                            {/* <div className="shellText2"> specificMeeting + " Meeting"</div> */}
                    </div>

                    {/* <div className="shellText2"> specificMeeting + " Meeting"</div> */}
                </div>

            </div>

            {/* <select defaultValue={memberType} onChange={e => changeMemberType(e.target.value)}>
<option defaultValue="Design">Design</option>
<option defaultValue="Product">Product</option>
<option defaultValue="Engineering">Engineering</option>
</select> */}
            {/* <h2>General Score: {generalScore}</h2> */}
            {/* {(generalScore >= 4) ? (generalScore >= 5) ? <h2>Terminated</h2> : <h2>Probation</h2> : <h2>Good Standing</h2>}
{memberType != "Member" && <h2>{memberType} Score: {roleScore}</h2>}
{memberType != "Member" && (roleScore >= 4) ? (roleScore >= 5) ? <h2>Terminated</h2> : <h2>Probation</h2> : <h2>Good Standing</h2>} */}

            <div style={{ height: 600, width: "100%", fontFamily: "Poppins,sans-serif" }}>
                <DataGrid
                    rows={meetingsWithAttendance}
                    columns={columns}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)} />
            </div>

            <div className="buttonGrouping">
                <button onClick={changeAdminStatus} className="adminButton">
                    Become Admin
                </button>
                {/* <button onClick={logOut} className="button">
Log Out
</button> */}
                {/* <button onClick={checkInPage} className="button">Check In Page</button> */}
            </div>
        </Layout>
        
        <Fragment>
                {/* <img src='/images/gmCard.png' className="gmCard"></img> */}
        </Fragment></>
    );
}