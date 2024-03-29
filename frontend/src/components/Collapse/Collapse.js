import React from 'react';
import { useHistory } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState, Fragment } from "react";
import { Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ArrowDropDown } from '@mui/icons-material'
import './style.css'

const { default: jwtDecode } = require("jwt-decode");
export default function Collapse(props) {
    const history = useHistory();
    useEffect(() => {
        async function getAttendance() {

            setMeetings(props.meetings);
            const attendance_list = await fetch("http://localhost:5500/attendance_list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("@token"),
                },
                body: JSON.stringify({ id: props.id }),
            });
            const attendance_list_result = await attendance_list.json();
            const temp = [];
            const tempMap = new Map();
            let tempScore = 0;
            let tempRoleScore = 0;
            let tempTardies = 0;
            let tempExcused = 0;
            let tempUnexcused = 0;
            let tempRoleTardies = 0;
            let tempRoleUnexcused = 0;
            let tempRoleExcused = 0;

            for (let i = 0; i < props.meetings.length; i++) {
                const attendance = attendance_list_result.data[i][0];
                var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
                tempJ["attendance"] = attendance;
                const type = attendance_list_result.data[i][1];
                if (attendance == 'Late') {
                    if (type == props.type) {
                        tempRoleScore += 0.5;
                        tempRoleTardies++;
                    } else if (type == "General") {
                        tempScore += 0.5;
                        tempTardies++;
                    }
                } else if (attendance == 'Absent') {
                    if (type == props.type) {
                        tempRoleScore += 1;
                        tempRoleUnexcused++;
                    } else if (type == "General") {
                        tempScore += 1;
                        tempUnexcused++;
                    }
                } else if (attendance == "Excused") {
                    if (type == props.type) {
                        tempRoleExcused++;
                    } else {
                        tempExcused++;
                    }
                }
                temp.push(tempJ);
                tempMap.set(props.meetings[i], attendance);
            }
            setGeneralScore(tempScore);
            setRoleScore(tempRoleScore);
            setRoleTardy(tempRoleTardies);
            setTardy(tempTardies);
            setExcused(tempExcused);
            setRoleExcused(tempRoleExcused);
            setUnexcused(tempUnexcused);
            setRoleUnexcused(tempRoleUnexcused);
            setAttendance(tempMap);
            setMeetings(temp);
            setAdmin(props.admin);
            setLoaded(true);
        }

        getAttendance();
    }, []);

    async function updateAttendance(value, id, api, field) {
        const res = await fetch("http://localhost:5500/update_attendance", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: "Bearer " + localStorage.getItem("@token"),
            },
            body: JSON.stringify({ member: props.id, id: id, status: value }),
        });
        const attendance_list_result = await res.json();
        const temp = [];
        const tempMap = new Map();
        let tempScore = 0;
        let tempRoleScore = 0;
        let tempTardies = 0;
        let tempExcused = 0;
        let tempUnexcused = 0;
        let tempRoleTardies = 0;
        let tempRoleUnexcused = 0;
        let tempRoleExcused = 0;
        for (let i = 0; i < props.meetings.length; i++) {
            const attendance = attendance_list_result.data[i][0];
            var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
            tempJ["attendance"] = attendance;
            const type = attendance_list_result.data[i][1];
            if (attendance == 'Late') {
                if (type == props.type) {
                    tempRoleScore += 0.5;
                    tempRoleTardies++;
                } else if (type == "General") {
                    tempScore += 0.5;
                    tempTardies++;
                }
            } else if (attendance == 'Absent') {
                if (type == props.type) {
                    tempRoleScore += 1;
                    tempRoleUnexcused++;
                } else if (type == "General") {
                    tempScore += 1;
                    tempUnexcused++;
                }
            } else if (attendance == "Excused") {
                if (type == props.type) {
                    tempRoleExcused++;
                } else {
                    tempExcused++;
                }
            }
            temp.push(tempJ);
            tempMap.set(props.meetings[i], attendance);
        }
        const isValid = await api.commitCellChange({ id, field });
        if (isValid) {
            api.setCellMode(id, field, 'view');
        }
        setGeneralScore(tempScore);
        setRoleScore(tempRoleScore);
        setRoleTardy(tempRoleTardies);
        setTardy(tempTardies);
        setExcused(tempExcused);
        setRoleExcused(tempRoleExcused);
        setUnexcused(tempUnexcused);
        setRoleUnexcused(tempRoleUnexcused);

        setAttendance(tempMap);
        setMeetings(temp);
    }
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
        return <button id="button" style={{ fontFamily: "Poppins,sans-serif", fontWeight: 600, fontSize: "18px", color: color, cursor: "pointer", backgroundColor: backgroundColor, height: "40px", border: "none", paddingLeft: "15px", paddingRight: "15px" }}>{params.value}</button>;
    }

    function editAttendance(props) {
        const { id, value, api, field } = props;

        return <select defaultValue={value} onChange={(e) => updateAttendance(e.target.value, id, api, field)}>
            <option defaultValue="Absent">Absent</option>
            <option defaultValue="Late">Late</option>
            <option defaultValue="Present">Present</option>
            <option defaultValue="Excused">Excused</option>
        </select>;
    }

    async function handleAdmin() {
        if (!admin) {
            const res = await fetch("http://localhost:5500/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("@token"),
                },
                body: JSON.stringify({ member: { user_id: props.id } }),
            });
            setAdmin(true);
        } else {

            const res = await fetch("http://localhost:5500/revokeAdmin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("@token"),
                },
                body: JSON.stringify({ member: { user_id: props.id } }),
            });

            setAdmin(false);
            if (jwtDecode(localStorage.getItem("@token")).user_id == props.id) {
                history.push("/");
            }
        }

    }
    const [generalScore, setGeneralScore] = useState(0);
    const [roleScore, setRoleScore] = useState(0);
    const [roleExcused, setRoleExcused] = useState(0);
    const [roleUnexcused, setRoleUnexcused] = useState(0);
    const [roleTardy, setRoleTardy] = useState(0);
    const [excused, setExcused] = useState(0);
    const [unexcused, setUnexcused] = useState(0);
    const [tardy, setTardy] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [attendance, setAttendance] = useState(new Map());
    const [isOpen, setIsOpen] = useState(false);
    const [meetingSelection, setMeetingSelection] = useState([]);
    let typeBackgroundColor = "#EFEFEF";
    let typeColor = "#676767";

    if (props.type == "Engineering") {
        typeBackgroundColor = "rgba(218, 233, 251, 0.45)";
        typeColor = "#8BBEF9";
    } else if (props.type == "Product") {
        typeBackgroundColor = "#F9F2FF";
        typeColor = "#C175FF";
    } else if (props.type == "Design") {
        typeBackgroundColor = "rgba(203, 233, 233, 0.47)";
        typeColor = "#75D0D0";
    }
    if (props.admin) {
        typeBackgroundColor = "#FFF2E1";
        typeColor = "#EBA23B";
    }
    const columns = [
        { field: 'name', headerName: 'Meeting Name', minWidth: 130, flex: 1 },
        { field: 'day', headerName: 'Day', minWidth: 130, flex: 1 },
        { field: 'type', headerName: 'Meeting Type', minWidth: 130, flex: 1 },
        { field: 'attendance', headerName: 'Attendance', minWidth: 130, flex: 1, renderEditCell: editAttendance, renderCell: renderAttendance, editable: true },
    ];
    const [sortModel, setSortModel] = useState([
        {
            field: 'day',
            sort: 'desc',
        },
    ]);


    return (
        <div>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ArrowDropDown />}
                >
                    {props.name}
                </AccordionSummary>
                <AccordionDetails>
                    <div style={{ flexGrow: 1 }}>
                        <div id="head" className="row">
                            <div id="head" className="column">
                                <h4 className="title">General Meeting</h4>
                            </div>
                            <div id="head" className="column">
                                {generalScore >= 4 ? <h4 className="absent">{generalScore} of 5 absences used</h4>
                                    : <h4 className="score">{generalScore} of 5 absences used</h4>}
                            </div>
                        </div>

                        <div id="scores" className="row">
                            <div id="scores" className="column">
                                <h4>{tardy}</h4>
                                <h5>Tardies</h5>
                            </div>
                            <div id="scores" className="column">
                                <h4>{unexcused}</h4>
                                <h5>Unexcused</h5>
                            </div>
                            <div id="scores" className="column">
                                <h4>{excused}</h4>
                                <h5>Excused</h5>
                            </div>
                        </div>
                        <div id="head" className="row">
                            <div id="head" className="column">
                                <h4 className="title">{props.type} Meeting</h4>
                            </div>
                            <div id="head" className="column">
                                {roleScore >= 4 ? <h4 className="absent">{roleScore} of 5 absences used</h4>
                                    : <h4 className="score">{roleScore} of 5 absences used</h4>}
                            </div>
                        </div>
                        <div id="scores" className="row">
                            <div id="scores" className="column">
                                <h4>{roleTardy}</h4>
                                <h5>Tardies</h5>
                            </div>
                            <div id="scores" className="column">
                                <h4>{roleUnexcused}</h4>
                                <h5>Unexcused</h5>
                            </div>
                            <div id="scores" className="column">
                                <h4>{roleExcused}</h4>
                                <h5>Excused</h5>
                            </div>
                        </div>
                        <DataGrid className="grid"
                            autoHeight
                            rows={meetings}
                            columns={columns}
                            onSelectionModelChange={(newSelectionModel) => {
                                setMeetingSelection(newSelectionModel);
                            }}
                            selectionModel={meetingSelection}
                            sortModel={sortModel}
                            onSortModelChange={(model) => setSortModel(model)}
                        />
                        {admin ? <button className="exec" onClick={handleAdmin}>Remove Exec</button> : <button className="exec" onClick={handleAdmin}>Make Exec</button>}
                    </div>
                </AccordionDetails>
            </Accordion >
        </div>

    )
}