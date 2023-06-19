import React from 'react';
import Header from '../Archive/header';
import PoseDetector from '../Pushup-Detector/poseDetector';

function VideoPage()  {
    return (
        <div>
            <Header />
            <h2> this is where to video</h2>
            <PoseDetector />
        </div>
    );
};

export default VideoPage;