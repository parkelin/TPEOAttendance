import "./style.css";
import React from "react";
import { Switch, Route } from "react-router-dom";

import Home from "./pages/Home/Home.js";
import Login from "./pages/GoogleSignIn/GoogleSignIn.js";
import Admin from "./pages/Admin/Admin.js";
import CheckIn from "./pages/CheckIn/CheckIn.js";
import AdminMeetings from "./pages/Admin/Meetings.js";

export default function App() {
  return (
    <div className="global-container">
      <div className="content-container">
        <Switch>
          {/* The Switch decides which component to show based on the current URL.*/}
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
              <Login/>
          </Route>
          <Route exact path="/admin">
              <Admin/>
          </Route>
          <Route exact path="/admin/meetings">
              <AdminMeetings/>
          </Route>
          <Route exact path="/checkin">
              <CheckIn/>
          </Route>
          
        </Switch>
      </div>
    </div>
  );
}