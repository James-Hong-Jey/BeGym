import React from "react";
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
// Only compatible with react-router-dom v5.2 so using Switch instead of Routes
import './App.css';
import LoginPage from './Components/Pages/LoginPage';
import HomePage from "./Components/Pages/Homepage";
import FriendsPage from "./Components/Pages/FriendsPage";
import VideoPage from "./Components/Pages/VideoPage";
import Post from "./Components/Posts/postPage";


function App() {
  

  return (
   <Router>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li>
          <Link to={'/login'} className="nav-link"> <button>Login Page</button> </Link>
          <Link to={'/home'} className="nav-link"> <button>Home Page</button> </Link>
          <Link to={'/video'} className="nav-link"> <button>Video Page</button> </Link>
          <Link to={'/friends'} className="nav-link"> <button>Friends Page</button> </Link>
       </li>
      </ul>
    </nav>
    <Switch>
      <Route exact path="/login" component={LoginPage}/>
      <Route exact path="/home" component={HomePage}/>
      <Route exact path="/post/:id" component={Post} />
      <Route exact path="/video" component={VideoPage} />
      <Route exact path="/friends" component={FriendsPage} /> 
    </Switch>
   </Router>
  );
}

export default App;
