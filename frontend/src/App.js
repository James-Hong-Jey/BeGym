import React from "react";
import './App.css';
import LoginRegistration from "./Components/loginRegistration.js";
import Header from "./Components/header";
import PoseDetector from "./Components/poseDetector";

// For testing webcam functionality with cocossd
import Test_pose from "./Components/webcam";

function App() {

  return (
    <div className="App">
      <Header/>
      <PoseDetector/>
      <LoginRegistration/>
    </div>
  );
}

export default App;