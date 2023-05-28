import React from "react";
import './App.css';
import LoginRegistration from "./Components/loginRegistration.js";
import Header from "./Components/header";

function App() {

  return (
    <div className="App">
      <Header/>
      <LoginRegistration/>
    </div>
  );
}

export default App;