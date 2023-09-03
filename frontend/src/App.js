import React, { useState, useEffect } from "react";
import './App.css';
import PoseDetector from "./Pushup-Detector/poseDetector";
import chopper from "./Assets/chopper.png"

function App() {

  const baseUrl = process.env.REACT_APP_BASE_URL || 'http:/localhost:8080';

  return (
    <div className="App">
      <nav>
        <img src={chopper}
          style={{
              width: 160,
              height: "auto",
              left: 0,
            }}
        />
      </nav>
      <PoseDetector />
    </div>
  );
}

export default App;

/*
<Link to={'/friends'} className="nav-link"> <button>Friends Page</button> </Link>
<Route exact path="/friends" component={FriendsPage} /> 
*/