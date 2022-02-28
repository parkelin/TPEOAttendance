import "./style.css";
import React, { useEffect, useState, useRef, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Login from "../../components/Login/Login.js";
import { DataGrid } from '@mui/x-data-grid';
import welcome from './welcome.png';
import rightAccent from './rightAccent.png';
import DatePicker from 'sassy-datepicker';
import image1 from './accent1.png';

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
                if (resp.data.admin) {
                    history.push("/admin");
                }
                setName(decode.name);
                setUser(jwtDecode(localStorage.getItem("@token")));
                setLoaded(true);
                setMemberType(resp.data.type);
            }
        }

        loadCredentials();
    }, []);


    function Example() {
        const [date, setDate] = useState(new Date());

        const onChange = newDate => {
            console.log(`New date selected - ${newDate.toString()}`);
            setDate(newDate);
        };

        return <DatePicker onChange={onChange} selected={date} />;
    }


    async function checkInPage() {
        history.push("/checkin")
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
    }

    async function attendanceHistory() {
        history.push("/attendanceHistory")
    }

    const [memberType, setMemberType] = useState("");
    const [user, setUser] = useState(null);
    const [name, setName] = useState("");
    const [loaded, setLoaded] = useState(false);

    return !loaded ? null : (
        memberType == "Member" ? <Fragment>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
            </style>
            <img src={image1} className="leftImage"></img>
            <img src={image1} className="rightImage"></img>
            <div className="heading">
                <h1 className="title-text"></h1>
            </div>
            <h2 id="onboarding">Welcome,</h2>
            <h2 id="role">Please select your role:</h2>
            <div id="group">
            <button onClick={() => changeMemberType("Design")} className="available">
                Design
            </button>
            <button onClick={() => changeMemberType("Product")} className="available">
                Product
            </button>
            <button onClick={() => changeMemberType("Engineering")} className="available">
                Engineering
            </button>
            </div>
            
        </Fragment> :
            <Fragment>
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
                </style>
                <div>
                    <img src={welcome} className="welcomeImg"></img>
                </div>
                <img src={rightAccent} className="rightAccent"></img>

                {/* Calender */}
                {/* <div className="cal">
                    <DatePicker />
                </div> */}

                {/* Attendance & History Buttons */}
                <div>
                    <button onClick={() => checkInPage()} className="attendanceButton">
                        Attendance
                    </button>
                    <button onClick={() => attendanceHistory()} className="attendanceButton">
                        History
                    </button>
                    <button onClick={() => setMemberType("Member")}>Press</button>
                </div>
            </Fragment>
    );
}