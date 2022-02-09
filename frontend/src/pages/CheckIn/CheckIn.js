import "./style.css";
import { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default function Header() {
  const history = useHistory();
  async function meetingsPage(){
    
  }
  return (
    <><><Fragment>
      <div className="heading">
        <h1 className="title-text">Check-In</h1>
      </div>
      <button onClick={meetingsPage} className="generalBtn">
        General Meeting
      </button>

      <button onClick={meetingsPage} className="generalBtnClick">
        General Meeting
      </button>

      <button onClick={meetingsPage} className="designBtn">
        Design Meeting
      </button>

      <button onClick={meetingsPage} className="designBtnClick">
        Design Meeting
      </button>

      <button onClick={meetingsPage} className="productBtn">
        Product Meeting
      </button>

      <button onClick={meetingsPage} className="productBtnClick">
        Product Meeting
      </button>

      <button onClick={meetingsPage} className="engBtn">
        Engineering Meeting
      </button>

      <button onClick={meetingsPage} className="engBtnClick">
        Engineering Meeting
      </button>
    </Fragment>

      <button onClick={meetingsPage} className="continueBtn">
        CONTINUE
      </button></><div>Check In</div><div>
      <p>
        Enter your passcode in the box below. This is a specialized key generated only for this meeting.
      </p>
      </div></>
  );
}