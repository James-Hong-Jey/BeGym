import React from "react";
import './App.css';
import LoginRegistration from "./Components/loginRegistration.js";
import Header from "./Components/header";
import Test_pose from "./Components/webcam";

function App() {

  return (
    <div className="App">
      <Header/>
      <Test_pose/>
      <LoginRegistration/>
    </div>
  );
}

export default App;