import React from 'react';
import Header from '../Archive/header';
import PoseDetector from '../Pushup-Detector/poseDetector';
import NewPost from '../Posts/newPost';

function VideoPage()  {
    return (
        <div>
            <Header />
            <PoseDetector />
            <NewPost />
        </div>
    );
};

export default VideoPage;