import React from 'react';
import Collapsible from "@kunukn/react-collapse";
import { useHistory } from "react-router-dom";
import "./collapsible.scss";
import "./style.css";
import cx from "classnames";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState, Fragment } from "react";
import { alignProperty } from '@mui/material/styles/cssUtils';
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
            for (let i = 0; i < props.meetings.length; i++) {
                const attendance = attendance_list_result.data[i][0];
                var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
                tempJ["attendance"] = attendance;
                const type = attendance_list_result.data[i][1];
                if (attendance == 'Late') {
                    if (type == props.type) {
                        tempRoleScore += 0.5;
                    } else if(type == "General") {
                        tempScore += 0.5;
                    }
                } else if (attendance == 'Absent') {
                    if (type == props.type) {
                        tempRoleScore += 1;
                    } else if(type == "General"){
                        tempScore += 1;
                    }
                }
                temp.push(tempJ);
                tempMap.set(props.meetings[i], attendance);
            }

            setGeneralScore(tempScore);
            setRoleScore(tempRoleScore);
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
        let tempRoleScore = 0;
        let tempScore = 0;
        for (let i = 0; i < props.meetings.length; i++) {
            const attendance = attendance_list_result.data[i][0];
            var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
            tempJ["attendance"] = attendance;
            const type = attendance_list_result.data[i][1];
            if (attendance == 'Late') {
                if (type == props.type) {
                    tempRoleScore += 0.5;
                } else if(type == "General") {
                    tempScore += 0.5;
                }
            } else if (attendance == 'Absent') {
                if (type == props.type) {
                    tempRoleScore += 1;
                } else if(type == "General"){
                    tempScore += 1;
                }
            }
            setGeneralScore(tempScore);
            setRoleScore(tempRoleScore);
            temp.push(tempJ);
            tempMap.set(props.meetings[i], attendance);
        }
        const isValid = await api.commitCellChange({ id, field });
        if (isValid) {
            api.setCellMode(id, field, 'view');
        }
        setAttendance(tempMap);
        setMeetings(temp);
    }
    function renderAttendance(params) {
        let color = 'black';
        let backgroundColor = 'black';
        if(params.value=="Present"){
            color = "#6EC47F";
            backgroundColor = "#CBE9D1";
        }else if(params.value=="Absent"){
            color = "#EF7357";
            backgroundColor = "#FDEAE5";
        }else if(params.value=="Excused"){
            color = "#64A9F7";
            backgroundColor = "#C5E0FF";
        }else{
            color = "#D39800";
            backgroundColor = "#FCEFCC";
        }
        return <button id="button" style={{fontFamily: "Poppins,sans-serif", fontWeight: 600, color: color, backgroundColor: backgroundColor, border: "none", padding: "3px", borderRadius: "10px"}}>{params.value}</button>;
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

    async function handleAdmin(){
        if(!admin){
            const res = await fetch("http://localhost:5500/admin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("@token"),
                },
                body: JSON.stringify({ member: {user_id: props.id} }),
            });
            setAdmin(true);
        }else{
            
            const res = await fetch("http://localhost:5500/revokeAdmin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("@token"),
                },
                body: JSON.stringify({ member: {user_id: props.id} }),
            });
            
            setAdmin(false);
            if(jwtDecode(localStorage.getItem("@token")).user_id == props.id){
                history.push("/");
            }
        }
        
    }
    const [generalScore, setGeneralScore] = useState(0);
    const [roleScore, setRoleScore] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [admin, setAdmin] = useState(false);
    const [meetings, setMeetings] = useState([]);
    const [attendance, setAttendance] = useState(new Map());
    const [isOpen, setIsOpen] = useState(false);
    const [meetingSelection, setMeetingSelection] = useState([]);
    const columns = [
        { field: 'name', headerName: 'Meeting Name', width: 130 },
        { field: 'day', headerName: 'Day', width: 130 },
        { field: 'type', headerName: 'Meeting Type', width: 130 },
        { field: 'attendance', headerName: 'Attendance', width: 130, renderEditCell: editAttendance, renderCell: renderAttendance, editable: true },
    ];
    const [sortModel, setSortModel] = useState([
        {
            field: 'day',
            sort: 'desc',
        },
    ]);


    return <div className="collapsible">
        <button
            className={cx("collapsible__toggle", {
                "collapsible__toggle--active": isOpen
            })}
            onClick={() => setIsOpen(!isOpen)}
        >
            <span className="collapsible__toggle-text">{props.name} | {props.type} {(!loaded && props.admin) || (loaded && admin) ?"Exec":""}</span>
            <div className="rotate90">
                <svg
                    className={cx("icon", { "icon--expanded": isOpen })}
                    viewBox="6 0 12 24"
                >
                    <polygon points="8 0 6 1.8 14.4 12 6 22.2 8 24 18 12" />
                </svg>
            </div>
        </button>
        <Collapsible
            isOpen={isOpen}
            className={
                "collapsible__collapse collapsible__collapse--gradient " +
                (isOpen ? "collapsible__collapse--active" : "")
            }
        >
            <div className="collapsible__content">
                <div style={{ display: 'flex', height: '100%' }}>
                    <div style={{ flexGrow: 1 }}>
                        <DataGrid
                            autoHeight
                            rows={meetings}
                            columns={columns}
                            onSelectionModelChange={(newSelectionModel) => {
                                setMeetingSelection(newSelectionModel);
                            }}
                            selectionModel={meetingSelection}
                            sortModel={sortModel}
                            onSortModelChange={(model) => setSortModel(model)}
                            sx={{fontFamily:"Poppins,sans-serif", fontWeight: 200}}
                        />
                        {admin ? <button onClick={handleAdmin} className="button">Remove Exec</button> : <button onClick={handleAdmin} className="button">Make Exec</button>}
                        <button>General Score: {generalScore}</button>
                        <button>Role Score: {roleScore}</button>
                    </div>
                </div>
            </div>
        </Collapsible>
    </div>;
}