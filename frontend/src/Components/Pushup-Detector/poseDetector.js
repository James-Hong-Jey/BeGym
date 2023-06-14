import React, { useRef, useState } from "react";
import "../../App.css";
import "./pushup.css";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import * as poseDetection from '@tensorflow-models/pose-detection';

import { checkBackStraight, checkDistance, drawKeypoints, drawSkeleton, pushupAngle } from "./drawing-utilities";

// adapted from shamjam, harshbhatt7585 & nicknochnack smth


export default function PoseDetector() {

    // ADJUSTABLE VARIABLES
    const threshold = 0.4; // Sensitivity of detections
    const refresh_rate = 100; // in ms. can cause flickering
    const backStraightTolerance = 0.4 // lowkey arbitrary, 0.2 is very strict but doable in a single pose
    let buffer = 20; // How many detect calls before it decides to change state
    const pushupTolerance = 15; // How many degrees off from the target allowable

    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isFar, setIsFar] = useState(true);
    const [isStraight, setIsStraight] = useState(false);
    const [pushupDown, setPushupDown] = useState(false);
    const [pushupCount, setPushupCount] = useState(0);
    // let pushupCount = 0;

    let c_pushupCount = 0;
    let c_down = false;

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
                //console.log(poses);
                if ((poses && poses.length > 0)) {
                    setIsModelLoading(false);
                    let dist = checkDistance(poses[0].keypoints, threshold * 0.75)
                    let right = dist.right; // 0 is left, 1 is right
                    let color = "black"; // will be black if invalid

                    // setIsStraight(checkBackStraight(poses[0].keypoints, threshold, backStraightTolerance, right));
                    const straight = checkBackStraight(poses[0].keypoints, threshold, backStraightTolerance, right);
                    // console.log(straight);
                    // Prevents flickering between "far" and "near"
                    if (buffer > 0) {
                        if (dist.far !== isFar) { buffer--; }
                        else { buffer = 10; } // replenish buffer
                    } else {
                        setIsFar(dist.far); // consistently different
                    }

                    if (dist.far) {
                        color = straight ? "green" : "red";
                        // Start drawing & detecting
                        drawCanvas(poses, video, videoWidth, videoHeight, canvasRef, color);

                        if (pushupAngle(poses[0].keypoints, 90, pushupTolerance, right) && c_down === false) {
                            setPushupDown(true);
                            c_down = true;
                            console.log("down");
                            console.log(c_down);
                            console.log(c_pushupCount);
                        } else if (pushupAngle(poses[0].keypoints, 180, pushupTolerance, right) && c_down) {
                            // Counts as 1 pushup
                            setPushupDown(false);
                            setPushupCount(prevCount => (prevCount + 1));
                            c_down = false;
                            c_pushupCount++;
                            console.log("up");
                            console.log(c_down);
                            console.log(c_pushupCount);
                        }

                    } else {
                        // black lines if not in range
                        drawCanvas(poses, video, videoWidth, videoHeight, canvasRef, color);
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

                {isFar && !isModelLoading && (
                    <div className="loading-overlay">{c_pushupCount}</div>
                )}

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