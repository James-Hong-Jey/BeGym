import React from 'react';
import Header from './Components/header';
import Test_pose from './Components/webcam';
import PoseDetector from './Components/poseDetector';
import LoginRegistration from './Components/loginRegistration.js';
// For testing webcam functionality with cocossd
import Test_pose from "./Components/webcam";

const LoginPage = () => {
  return (
    <div>
      <Header />
      <Test_pose />
      <PoseDetector />
      <LoginRegistration />
    </div>
  );
};

export default LoginPage;