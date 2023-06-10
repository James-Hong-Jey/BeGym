// DRAWING UTILITIES
import c from "./constants";

// For pose detections

export function drawPoint(ctx, name, x, y, r, color = "red") {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;

    // Add text
    ctx.strokeSylt = color
    ctx.font = '18px Arial'
    ctx.fillText(name, x, y)

    ctx.fill();
}

// Draw keypoints on the canvas
export function drawKeypoints(keypoints, minConfidence = 0.3, ctx, scale = 1) {
    const color = "red";
    // 0 to 4 are face stuff, so can skip them
    for (let keypoint of keypoints.slice(5)) {
        if (keypoint.score < minConfidence) continue;
        const x = 640 - keypoint.x; // NOTE - I mirrored the webcam w scaleX(-1) so this is mirrored too
        const y = keypoint.y;
        drawPoint(ctx, keypoint.name, x * scale, y * scale, 10, color);
    }
}

export function drawSegment(ctx, from, to, color = "black", threshold = 0.3) {
    const { x: fx, y:fy, score: fs } = from;
    const { x: tx, y:ty, score: ts } = to;
    if(fs > threshold && ts > threshold){
        ctx.beginPath();
        // Remember that image is flipped
        ctx.moveTo(640-fx, fy);
        ctx.lineTo(640-tx, ty);
        ctx.lineWidth = 5;
        ctx.strokeStyle = color;
        ctx.stroke();
    }
}

export function drawSkeleton(keypoints, ctx, threshold = 0.3) {
    const color = "black";

    // idk if theres a better way to do this so imma just brute force
    drawSegment(ctx, keypoints[c.left_shoulder], keypoints[c.left_elbow], threshold);
    drawSegment(ctx, keypoints[c.left_wrist], keypoints[c.left_elbow], threshold);
    drawSegment(ctx, keypoints[c.left_shoulder], keypoints[c.left_hip], threshold);
    drawSegment(ctx, keypoints[c.left_hip], keypoints[c.left_knee], threshold);
    drawSegment(ctx, keypoints[c.left_knee], keypoints[c.left_ankle], threshold);

    drawSegment(ctx, keypoints[c.right_shoulder], keypoints[c.right_elbow], threshold);
    drawSegment(ctx, keypoints[c.right_wrist], keypoints[c.right_elbow], threshold);
    drawSegment(ctx, keypoints[c.right_shoulder], keypoints[c.right_hip], threshold);
    drawSegment(ctx, keypoints[c.right_hip], keypoints[c.right_knee], threshold);
    drawSegment(ctx, keypoints[c.right_knee], keypoints[c.right_ankle], threshold);
}

// Need to check user distance prior to proper functioning
export function checkDistance(keypoints, ctx, threshold = 0.3) {
    var msg = new SpeechSynthesisUtterance('Please stand 2 metres back.');
    window.speechSynthesis.speak(msg);
}

// For coco ssd object detection (webcam js and Test_pose)
 
export const drawRect = (detections, ctx) => {
    detections.forEach(prediction => {
        // Get Results
        const [x, y, width, height] = prediction['bbox'];
        const text = prediction['class'];

        // Styling
        const color = 'blue'
        ctx.strokeSylt = color
        ctx.font = '18px Arial'
        ctx.fillStyle = color

        // Draw Rectangles & Text
        ctx.beginPath()
        ctx.fillText(text, x, y)
        ctx.rect(x, y, width, height)
        ctx.stroke()
    })
}