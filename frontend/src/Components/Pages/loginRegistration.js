import React, { useState, useContext } from 'react'
import Axios from "axios"
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../helpers/AuthContext';

export default function LoginRegistration() {
  let history = useHistory();
  const [usernameReg, SetUsernameReg] = useState('');
  const [passwordReg, SetPasswordReg] = useState('');
  
  const baseUrl = process.env.REACT_APP_BASE_URL || 'http:/localhost:8080';

  const register = () => {
    Axios.post(`${baseUrl}/auth`, {
      username: usernameReg,
      password: passwordReg,
    }).then((response) => {
      if (response.data.error) {
        SetLoginStatus(response.data.error);
        alert(response.data.error)
      } else {
        SetLoginStatus(response.data);
        alert(response.data)
      }
    });
  };

  const [username, SetUsername] = useState('');
  const [password, SetPassword] = useState('');
  const [loginStatus, SetLoginStatus] = useState("");
  const { setAuthState } = useContext(AuthContext)

  const login = () => {
    Axios.post(`${baseUrl}/auth/login`, {
      username: username,
      password: password,
    }).then((response) => {
      if (response.data.error) {
        SetLoginStatus(response.data.error);
        alert(response.data.error)
      } else {
        localStorage.setItem("accessToken", response.data.token)
        setAuthState({
          username: response.data.username,
          id: response.data.id,
          status: true,
        })
        history.push('/home');
      }
    });
  };

  return (
    <div className='login'>
      <h1>Registration</h1>
      <div>
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => {
            SetUsernameReg(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => {
            SetPasswordReg(e.target.value);
          }}
        />
      </div>
      <button onClick={register}>Register</button>
      <div>
        <h1>Login</h1>
        <label>Username</label>
        <input
          type="text"
          onChange={(e) => {
            SetUsername(e.target.value);
          }}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          onChange={(e) => {
            SetPassword(e.target.value);
          }}
        />
      </div>
      <button onClick={login}>Login</button>
      <h1>{loginStatus}</h1>
    </div>
  )
};