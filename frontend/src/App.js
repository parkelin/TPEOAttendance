import "./style.css";
import React from "react";
import { Switch, Route } from "react-router-dom";

import Header from "./components/Header/Header.js";
import Home from "./pages/Home/Home.js";
import Login from "./pages/Login/Login.js";

export default function App() {
  return (
    <div className="global-container">
      <Header />
      <div className="content-container">
        <Switch>
          {/* The Switch decides which component to show based on the current URL.*/}
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/login">
              <Login/>
          </Route>
        </Switch>
      </div>
    </div>
  );
}