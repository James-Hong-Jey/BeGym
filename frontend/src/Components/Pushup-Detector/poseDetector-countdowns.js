import React, { useEffect, useRef, useState } from "react";
import "../../App.css";
import "./pushup.css";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import * as poseDetection from '@tensorflow-models/pose-detection';

import { checkBackStraight, checkDistance, drawKeypoints, drawSkeleton } from "./drawing-utilities";

// adapted from shamjam, harshbhatt7585 & nicknochnack smth


export default function PoseDetector() {

    // ADJUSTABLE VARIABLES
    const threshold = 0.5; // Sensitivity of detections
    const refresh_rate = 50; // in ms. can cause flickering
    const backStraightTolerance = 0.3 // lowkey arbitrary, 0.2 is very strict but doable in a single pose
    const timeLimit = 60;

    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isFar, setIsFar] = useState(true);

    // Countdown timers
    const [countdown, setCountdown] = useState(3); // counts down from 3
    const [gymCountdown, setGymCountdown] = useState(timeLimit); // counts down from 60
    useEffect( () => {
        if(IsFar) {
            const timer = setInterval( () => {
                setCountdown((countdown)=>{
                    if(countdown <= 0) {clearInterval(timer);}
                    else { return countdown - 1;}
                });
            }, 1000)
            return () => clearInterval(timer);
        }
    }, [IsFar])

    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const runPoseDetector = async () => {
        // This initialises webgpu backend (error otherwise)
        // can use wasm, webgpu, webgl, need to play around
        await tf.setBackend('webgl');
        await tf.ready();

        //const detectorConfig = { modeltype: poseDetection.movenet.modelType.SINGLEPOSE.THUNDER };
        const model = poseDetection.SupportedModels.MoveNet;
        //const detector = await poseDetection.createDetector(model, detectorConfig);
        const detector = await poseDetection.createDetector(model);

        // Set to detect every 100 ms
        setInterval(() => {
            detect(detector);
        }, refresh_rate)
    };

    const detect = async (detector) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            // var msg = new SpeechSynthesisUtterance('Jackie is mid asf');
            // window.speechSynthesis.speak(msg);

            // Get video properties
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            // set "video" dimensions
            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            // Make Detections
            const poses = await detector.estimatePoses(video);
            try {
                console.log(poses);
                if ((poses && poses.length > 0)) {
                    setIsModelLoading(false);
                    let dist = checkDistance(poses[0].keypoints, threshold*0.75)
                    setIsFar(dist.far);
                    if (dist.far) {

                        // Start countdown
                        let interval = setInterval(() => {
                            setCountdown((prevCountdown) => prevCountdown - 1);
                        }, 1000)

                        let gymInterval;
                        // Start drawing & detecting
                        if (countdown === 0 && gymCountdown > 0) {
                            clearInterval(interval);

                            gymInterval = setInterval(() => {
                                setGymCountdown((prevCountdown) => prevCountdown - 1);
                            }, 1000)

                            let color = "black";
                            let right = dist.right; // 0 is left, 1 is right
                            // if(poses[0].keypoints[9].score > 0.3) {color = "red";} else {color = "black";}
                            if (checkBackStraight(poses[0].keypoints, threshold, backStraightTolerance, right)) { color = "green" } else { color = "red" }
                            drawCanvas(poses, video, videoWidth, videoHeight, canvasRef, color);
                        }
                        if(gymCountdown <= 0) {clearInterval(gymInterval);}
                    }
                }
            } catch (err) {
                console.log(err);
            }
        }
    }

    const drawCanvas = async (poses, video, videoWidth, videoHeight, canvas, color) => {
        const ctx = canvas.current.getContext("2d");
        ctx.translate(videoWidth, 0);
        ctx.scale(-1, 1);
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;

        drawKeypoints(poses[0].keypoints, threshold, ctx);
        drawSkeleton(poses[0].keypoints, ctx, threshold, color);
    }

    runPoseDetector();

    return (
        <div className="App">
            <header className="App-header" style={{ position: "relative" }}>

                {isModelLoading &&
                    (<div className="loading-overlay">Loading Detector..</div>)}

                {!isFar && !isModelLoading &&
                    (<div className="loading-overlay">Please Move Back 2 Metres</div>)}

                {isFar && !isModelLoading && countdown !== 0 &&
                    (<div className="loading-overlay">{countdown}</div>)}

                {countdown === 0 && gymCountdown > 0 &&  
                    (<div className="loading-overlay"
                    style={{top: '90%', left: '90%'}}
                        >{gymCountdown}</div>)}

                <Webcam
                    ref={webcamRef}
                    muted={true}
                    mirrored={true}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: 640,
                        height: 480,
                    }}
                />
            </header>
        </div>
    );
}