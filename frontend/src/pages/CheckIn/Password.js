import "./style.css";
import { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import doneImg from './doneImg.png';
const { default: jwtDecode } = require("jwt-decode");

export default function Password() {
  const history = useHistory();
  useEffect(() => {
    async function loadCredentials() {
      // If the token doesn't exist, do not log in
      if (!localStorage.getItem("@token")) {
        history.push("/login");
      } else if (!localStorage.getItem("@meeting")) {
        history.push("/");
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
        const id = localStorage.getItem("@meeting");
        const passwd = await fetch("http://localhost:5500/password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("@token"),
          },
          body: JSON.stringify({ meeting: id }),
        });
        const passwrd = await passwd.json();
        setMeetingPassword(passwrd.data.password);
        setMeeting(passwrd.data);
        setUser(jwtDecode(localStorage.getItem("@token")));
        setUserInfo(resp.data);
        setLoaded(true);
      }
    }
    loadCredentials();

  }, []);
  async function completeCheckInPg() {
    if (Math.round(Date.parse(meeting.end) / 1000) < Math.round(Date.now() / 1000)) {
      history.push("/");
      return;
    }
    if (password == meetingPassword) {
      const decode = jwtDecode(localStorage.getItem("@token"));
      const late = Math.round(Date.now() / 1000) - Math.round(Date.parse(meeting.start) / 1000) > 600;
      const res = await fetch("http://localhost:5500/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + localStorage.getItem("@token"),
        },
        body: JSON.stringify({ member: decode, late: late, meeting: meeting }),
      });
      localStorage.removeItem("@meeting");
      setDone(true);
      setSubmissionError(false);
    } else {
      setSubmissionError(true);
    }

  }
  const today = new Date();
  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [meetingPassword, setMeetingPassword] = useState("");
  const [meeting, setMeeting] = useState(null);
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);
  const [submissionError, setSubmissionError] = useState(false);
  return !loaded ? null : !done ? (
    <Fragment>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      </style>
      <div className="password-group">
        <h2 className="checkIn">Check In</h2>
        <p className="text1">Enter your passcode in the box below. This is a specialized key</p>
        <p className="text2"> generated only for this meeting.</p>
        <input className="passBox" type="password" name="Password" value={password} onChange={(event) => setPassword(event.target.value)} />
        <button onClick={completeCheckInPg} className="passwordButton">
          CONTINUE
        </button>
      </div>

      {submissionError && <div className="alert">
        <span className="closebtn" onClick={() => setSubmissionError(false)}>&times;</span>
        Incorrect Password!
      </div>}
    </Fragment>
  ) : <Fragment>
        <img src={doneImg} className="done"></img>
        <h3 className="setText">You're All Set!</h3>
        <h5 className="bottomText">{user.name} has been checked in to {meeting.type} Meeting "{meeting.name}" at {(today.getMonth()+1)+'/'+(today.getDay())+'/'+today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes()}</h5>
      </Fragment>;
}