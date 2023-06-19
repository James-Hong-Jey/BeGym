import React from 'react';
import Header from '../Archive/header';
// For testing webcam functionality with cocossd
//import Test_pose from '../Pushup-Detector/cocossd-test';
//import PoseDetector from '../Pushup-Detector/poseDetector';
import LoginRegistration from './loginRegistration.js';


const LoginPage = () => {
  return (
    <div>
      <Header />
      <LoginRegistration />
    </div>
  );
};

export default LoginPage;