import React from 'react';
import Header from './Components/header';
import Test_pose from './Components/webcam';
import PoseDetector from './Components/poseDetector';
import LoginRegistration from './Components/loginRegistration.js';

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