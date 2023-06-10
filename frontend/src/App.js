import React from "react";
import { BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
// Only compatible with react-router-dom v5.2 so using Switch instead of Routes
import './App.css';
import LoginPage from './Components/Home-Page/LoginPage';

function App() {
  return (
   <Router>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <ul className="navbar-nav mr-auto">
        <li><Link to={'/login'} className="nav-link"> Login Page </Link></li>
      </ul>
    </nav>
    <Switch>
      <Route path="/login" component={LoginPage} /> 
    </Switch>
   </Router>
  );
}

export default App;
