import "./style.css";
import { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
const { default: jwtDecode } = require("jwt-decode");
export default function Password() {
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
        setUser(jwtDecode(localStorage.getItem("@token")));
        setUserInfo(resp.data);
        setLoaded(true);
      }
    }
    loadCredentials();
  }, []);

  const [loaded, setLoaded] = useState(false);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  return !loaded ? null : (
    <Fragment>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
      </style>
      <h2>Check In</h2>
      <p>Enter your passcode in the box below. This is a specialized key generated only for this meeting.</p>

      
      {/* Attendance History Page/Function? */}
      <button className="passwordContinueButton">
        CONTINUE
      </button>
    </Fragment>
  );
}