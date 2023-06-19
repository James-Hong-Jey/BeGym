import React, { useEffect, useRef, useState } from "react";
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
    const refresh_rate = 50; // in ms. can cause flickering
    const backStraightTolerance = 0.4 // lowkey arbitrary, 0.2 is very strict but doable in a single pose
    let buffer = 20; // How many detect calls before it decides to change state
    const pushupTolerance = 20; // How many degrees off from the target allowable

    const [isModelLoading, setIsModelLoading] = useState(true);
    const [isFar, setIsFar] = useState(false);
    const [isStraight, setIsStraight] = useState(false);
    const [pushupDown, setPushupDown] = useState(false);
    const [pushupCount, setPushupCount] = useState(-1); // bug - +1s immediately upon render
    const [pushupValid, setPushupValid] = useState(true);
    const [lineColor, setLineColor] = useState("black");

    // update pushupCount when down -> up
    useEffect( () => {
        console.log("Pushup Down: " + pushupDown);

        // Reached the top
        if(!pushupDown) {
            // increment if it was valid all the way and reached the top
            if(pushupValid)
                setPushupCount(prevCount => prevCount + 1);

            // Regardless, resets the pushup as valid from the top
            setPushupValid(true);
        }
    }, [pushupDown, pushupValid]);

    // Invalidates the pushup if it ever unstraightens
    // useEffect( () => {
        // console.log("Back Straight?: " + isStraight);
        // // setLineColor(isStraight ? "green" : "red");
        // if(!isStraight) { // if not it renders at the start and is annoying
            // setPushupValid(false);
            // if(isFar) {
                // var msg = new SpeechSynthesisUtterance('Straighten your back stupid');
                // window.speechSynthesis.speak(msg);
            // }
        // }
    // }, [isStraight, isFar])

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
                    let color = "black";

                    // Prevents flickering between "far" and "near"
                    if (buffer > 0) {
                        if (dist.far !== isFar) { buffer--; }
                        else { buffer = 10; } // replenish buffer
                    } else {
                        setIsFar(dist.far); // consistently different
                    }

                    if (dist.far) { // supposed to be the isFar state but it flickers so idk why
                        const straight = checkBackStraight(poses[0].keypoints, threshold, backStraightTolerance, right);
                        // if(!straight) setPushupValid(false);
                        // setIsStraight(straight);
                        color = straight ? "green" : "red";

                        // Start drawing & detecting
                        drawCanvas(poses, video, videoWidth, videoHeight, canvasRef, color);

                        // PUSHUP ALGORITHM
                        // At bottom, sets the pushupDown state. At the top, if pushupDown is true, increments pushupCount
                        if (pushupAngle(poses[0].keypoints, 90, pushupTolerance, right)) {
                            setPushupDown(true);
                        } else if (pushupAngle(poses[0].keypoints, 180, pushupTolerance, right) && pushupDown) {
                            setPushupDown(false);
                            setPushupValid(true);
                        }
                    } else {
                        // black lines if not in range
                        setLineColor("black");
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
                    <div className="loading-overlay">{pushupCount}</div>
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