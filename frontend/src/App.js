import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
// Only compatible with react-router-dom v5.2 so using Switch instead of Routes
import './App.css';
import LoginPage from './Components/Pages/LoginPage';
import HomePage from "./Components/Pages/Homepage";
// import FriendsPage from "./Components/Pages/FriendsPage";
import VideoPage from "./Components/Pages/VideoPage";
import Post from "./Components/Posts/postPage";
import pushup from "./Assets/chopper.png"
import { AuthContext } from './helpers/AuthContext'
import axios from "axios";

function App() {

  const baseUrl = process.env.REACT_APP_BASE_URL || 'http:/localhost:8080';
  let history = useHistory();

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  })

  useEffect( () => {
    axios.get(`${baseUrl}/auth/auth`).then((response) => {
      if(response.data.error){
        setAuthState({...authState, status: false})
      } else {
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        })
      }
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("accessToken")
    setAuthState({
      username: "",
      id: 0,
      status: false
    })
    // history.push('/login');
  }

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <img src={pushup} width="70" height="70" className='headerPhoto' />
            {!authState.status ? (
              <>
              <Link to={'/login'} className="nav-link"> <button>Login Page</button> </Link>
              <Link to={'/video'} className="nav-link"> <button>TEST</button> </Link>
              </>
            ) : (
              <>
                <Link to={'/home'} className="nav-link"> <button>Post Feed</button> </Link>
                <Link to={'/video'} className="nav-link"> <button>My Gym</button> </Link>
                <div className="logout">
                  <button onClick={()=>logout()}>Log Out</button>
                  <label>{authState.username}</label>
                </div>
              </>
            )}
          </nav>
          <Switch>
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/home" component={HomePage} />
            <Route exact path="/post/:id" component={Post} />
            <Route exact path="/video" component={VideoPage} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;

/*
      <Link to={'/friends'} className="nav-link"> <button>Friends Page</button> </Link>
      <Route exact path="/friends" component={FriendsPage} /> 
      */