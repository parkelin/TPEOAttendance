import React from 'react';
import Collapsible from "@kunukn/react-collapse";
import "./collapsible.scss";
import "./style.css";
import cx from "classnames";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState, Fragment } from "react";
import { alignProperty } from '@mui/material/styles/cssUtils';
export default function Collapse(props) {
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
            for (let i = 0; i < props.meetings.length; i++) {
                const attendance = attendance_list_result.data[i];
                var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
                tempJ["attendance"] = attendance;

                temp.push(tempJ);
                tempMap.set(props.meetings[i], attendance);
            }
            setAttendance(tempMap);
            setMeetings(temp);
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
        for (let i = 0; i < props.meetings.length; i++) {
            const attendance = attendance_list_result.data[i];
            var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
            tempJ["attendance"] = attendance;

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

    function editAttendance(props) {
        const { id, value, api, field } = props;

        return <select defaultValue={value} onChange={(e) => updateAttendance(e.target.value, id, api, field)}>
            <option defaultValue="Absent">Absent</option>
            <option defaultValue="Late">Late</option>
            <option defaultValue="Present">Present</option>
            <option defaultValue="Excused">Excused</option>
        </select>;
    }

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
            <span className="collapsible__toggle-text">{props.name}</span>
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
                    </div>
                </div>
            </div>
        </Collapsible>
    </div>;
}