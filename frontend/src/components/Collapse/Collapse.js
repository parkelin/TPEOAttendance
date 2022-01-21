import React from 'react';
import Collapsible from "@kunukn/react-collapse";
import "./collapsible.scss";
import cx from "classnames";
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState, Fragment } from "react";
import { alignProperty } from '@mui/material/styles/cssUtils';
export default function Collapse(props) {
    useEffect(() => {
        async function getAttendance() {
            setMeetings(props.meetings);
            const attendance_list = await fetch("http://localhost:5000/attendance_list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: "Bearer " + localStorage.getItem("@token"),
                },
                body: JSON.stringify({ id: props.id }),
            });
            const attendance_list_result = await attendance_list.json();
            const temp = [];
            for (let i = 0; i < props.meetings.length; i++) {
                const attendance = attendance_list_result.data[i];
                var tempJ = JSON.parse(JSON.stringify(props.meetings[i]));
                tempJ["attendance"] = attendance;

                temp.push(tempJ);
            }
            setAttendance(attendance_list_result.data);
            setMeetings(temp);
        }

        getAttendance();
    }, []);
    const [meetings, setMeetings] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [meetingSelection, setMeetingSelection] = useState([]);
    const columns = [
        { field: 'name', headerName: 'Meeting Name', width: 130 },
        { field: 'day', headerName: 'Day', width: 130 },
        { field: 'type', headerName: 'Meeting Type', width: 130 },
        { field: 'attendance', headerName: 'Attendance', width: 130 },
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
                            checkboxSelection
                            onSelectionModelChange={(newSelectionModel) => {
                                setMeetingSelection(newSelectionModel);
                            }}
                            selectionModel={meetingSelection}
                            sortModel={sortModel}
                            onSortModelChange={(model) => setSortModel(model)}


                        />
                    </div>
                </div>
            </div>
        </Collapsible>
    </div>;
}