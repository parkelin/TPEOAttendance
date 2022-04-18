import "./checkIn.css";
import { Fragment, useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import Layout from '../../components/Layout/Layout'

const { default: jwtDecode } = require("jwt-decode");

export default function CheckIn() {
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
        setUser(jwtDecode(localStorage.getItem("@token")));
        setUserInfo(resp.data);
        const meetings_list = await fetch("http://localhost:5500/meetings_list", {
          method: "GET",
          headers: {
            authorization: "Bearer " + localStorage.getItem("@token"),
          },
        });
        const meetings_list_result = await meetings_list.json();
        for (let i = 0; i < meetings_list_result.data.length; i++) {
          const meeting = meetings_list_result.data[i];
          if (!resp.data.hasOwnProperty(meeting.id) && date >= Math.round(Date.parse(meeting.start) / 1000) && date < Math.round(Date.parse(meeting.end) / 1000)) {
            if (meeting.type == "General") {
              setGeneral(meeting);
            } else if (meeting.type == "Engineering") {
              setEngineering(meeting);
            } else if (meeting.type == "Design") {
              setDesign(meeting);
            } else if (meeting.type == "Product") {
              setProduct(meeting);
            }
          }
          //Math.floor(((Date.parse(meeting.end) / 1000) - date) / 60)}m {Math.floor(((Date.parse(meeting.end) / 1000) - date) % 60)s;
        }
        setMeetings(meetings_list_result.data);
        setLoaded(true);
      }
    }
    loadCredentials();
  }, []);

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
  }

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }

  async function signIn(type) {
    let meeting = null;
    if (type == "General") {
      meeting = general;
    } else if (type == "Engineering") {
      meeting = engineering;
    } else if (type == "Design") {
      meeting = design;
    } else if (type == "Product") {
      meeting = product;
    }
    if (meeting == null)
      return;
    localStorage.setItem("@meeting", meeting.id);
    user_info();
    if (type == "General") {
      setGeneral(null);
    } else if (type == "Engineering") {
      setEngineering(null);
    } else if (type == "Design") {
      setDesign(null);
    } else if (type == "Product") {
      setProduct(null);
    }
    history.push("checkin/password");
  }

  const [general, setGeneral] = useState(null);
  const [engineering, setEngineering] = useState(null);
  const [design, setDesign] = useState(null);
  const [product, setProduct] = useState(null);
  const [date, setDate] = useState(Math.round(Date.now() / 1000));
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [meetings, setMeetings] = useState([]);
  return !loaded ? null : (
    <Layout
      headerTitle="Check In"
      headerFixed
    >
      <div id="grouping">
        <button onClick={() => signIn("General")} className={(general != null && !userInfo.hasOwnProperty(general.id) && date >= Math.round(Date.parse(general.start) / 1000) && date < Math.round(Date.parse(general.end) / 1000)) ? "available" : "unavailable"}>
          General Meeting
        </button>

        <button onClick={() => signIn("Design")} className={(design != null && !userInfo.hasOwnProperty(design.id) && date >= Math.round(Date.parse(design.start) / 1000) && date < Math.round(Date.parse(design.end) / 1000)) ? "available" : "unavailable"}>
          Design Meeting
        </button>

        <button onClick={() => signIn("Product")} className={(product != null && !userInfo.hasOwnProperty(product.id) && date >= Math.round(Date.parse(product.start) / 1000) && date < Math.round(Date.parse(product.end) / 1000)) ? "available" : "unavailable"}>
          Product Meeting
        </button>

        <button onClick={() => signIn("Engineering")} className={(engineering != null && !userInfo.hasOwnProperty(engineering.id) && date >= Math.round(Date.parse(engineering.start) / 1000) && date < Math.round(Date.parse(engineering.end) / 1000)) ? "available" : "unavailable"}>
          Engineering Meeting
        </button>
      </div>
    </Layout>
  );
}