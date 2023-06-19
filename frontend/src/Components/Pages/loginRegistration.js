import React, { useState } from 'react'
import Axios from "axios"
import { useHistory } from 'react-router-dom';


export default function LoginRegistration() {
  let history = useHistory();
  const [usernameReg,SetUsernameReg] = useState('');
  const [passwordReg,SetPasswordReg] = useState('');

  const register = () => {
    Axios.post('http://localhost:8080/register', {
      username: usernameReg,
      password: passwordReg, 
    }).then( (response) => {
      console.log(response);
    });
  };

  const [username,SetUsername] = useState('');
  const [password,SetPassword] = useState('');

  const [loginStatus,SetLoginStatus] = useState("");

  const login = () => {
    Axios.post('http://localhost:8080/login', {
      username: username,
      password: password, 
    }).then( (response) => {
      console.log(response.data);
      if(response.data.message) {
        SetLoginStatus(response.data.message);
      } else {
        // SetLoginStatus(response);
        SetLoginStatus('Success!');
        history.push('/home');

      }
    });
  };

  

  return (
    <div>
      <div className="Registration">
        <h1>Registration</h1>
        <label>Username</label>
        <input
          type="text"
          onChange={(e)=>{
            SetUsernameReg(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e)=>{
            SetPasswordReg(e.target.value);
          }}
        />
        <button onClick={register}>Register</button>
      </div>
      <div className="Login">
        <h1>Login</h1>
        <label>Username</label>
        <input
          type="text"
          onChange={(e)=>{
            SetUsername(e.target.value);
          }}
        />
        <label>Password</label>
        <input
          type="text"
          onChange={(e)=>{
            SetPassword(e.target.value);
          }}
        /> 
        <button onClick={login}>Login</button>
        <h1>{loginStatus}</h1>
      </div>
    </div>
  )
};