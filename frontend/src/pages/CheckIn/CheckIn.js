import "./style.css";
import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Header() {
  const history = useHistory();
  async function meetingsPage(){
    
  }
  
  return (
    <><><Fragment>
      <head>
        <style>
              @import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');
        </style>
      </head>

      <div className="heading">
        <h1 className="title-text"></h1>
      </div>
      <button onClick={meetingsPage} className="generalButton">
        General Meeting
      </button>

      <button onClick={meetingsPage} className="designButton">
        Design Meeting
      </button>

      <button onClick={meetingsPage} className="productButton">
        Product Meeting
      </button>

      <button onClick={meetingsPage} className="engineeringButton">
        Engineering Meeting
      </button>
    </Fragment></><div>
      </div></>
  );
}