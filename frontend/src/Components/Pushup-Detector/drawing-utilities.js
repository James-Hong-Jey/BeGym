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
export function drawKeypoints(keypoints, threshold = 0.3, ctx, scale = 1) {
    const color = "red";
    // 0 to 4 are face stuff, so can skip them
    for (let keypoint of keypoints.slice(5)) {
        if (keypoint.score < threshold) continue;
        const x = 640 - keypoint.x; // NOTE - I mirrored the webcam w scaleX(-1) so this is mirrored too
        const y = keypoint.y;
        drawPoint(ctx, keypoint.score.toFixed(2), x * scale, y * scale, 10, color);
    }
}

export function drawSegment(ctx, from, to, threshold = 0.3, color) {
    const { x: fx, y:fy, score: fs } = from;
    const { x: tx, y:ty, score: ts } = to;
    if(fs > threshold && ts > threshold){
        ctx.strokeStyle = color;
        ctx.beginPath();
        // Remember that image is flipped
        ctx.moveTo(640-fx, fy);
        ctx.lineTo(640-tx, ty);
        ctx.lineWidth = 5;
        ctx.stroke();
    }
}

export function drawSkeleton(keypoints, ctx, threshold = 0.3, color) {
    // very brute force method but idk a better way
    drawSegment(ctx, keypoints[c.left_shoulder], keypoints[c.left_elbow], threshold, color);
    drawSegment(ctx, keypoints[c.left_wrist], keypoints[c.left_elbow], threshold, color);
    drawSegment(ctx, keypoints[c.left_shoulder], keypoints[c.left_hip], threshold, color);
    drawSegment(ctx, keypoints[c.left_hip], keypoints[c.left_knee], threshold, color);
    drawSegment(ctx, keypoints[c.left_knee], keypoints[c.left_ankle], threshold,color);

    drawSegment(ctx, keypoints[c.right_shoulder], keypoints[c.right_elbow], threshold, color);
    drawSegment(ctx, keypoints[c.right_wrist], keypoints[c.right_elbow], threshold,color);
    drawSegment(ctx, keypoints[c.right_shoulder], keypoints[c.right_hip], threshold,color);
    drawSegment(ctx, keypoints[c.right_hip], keypoints[c.right_knee], threshold,color);
    drawSegment(ctx, keypoints[c.right_knee], keypoints[c.right_ankle], threshold,color);
}

// Boolean function to check if all four points are visible
export function checkDistance(keypoints, threshold = 0.3) {
    let right;
    let left;
    for(let i = 5; i < 17; i++) {
        if(i % 2 === 0) {right += keypoints[i].score;}
        else {left += keypoints[i].score;}
    }
    let leftRight = right > left ? 1 : 0;
    
    const as = keypoints[c.left_ankle + leftRight].score;
    const ks = keypoints[c.left_knee + leftRight].score;
    const hs = keypoints[c.left_hip + leftRight].score;
    const ss = keypoints[c.left_shoulder + leftRight].score;

    if(as <= threshold || ks <= threshold || hs <= threshold || ss <= threshold){
        // var msg = new SpeechSynthesisUtterance('Please stand 2 metres back.');
        // window.speechSynthesis.speak(msg);
        return {far:false}
    } else {
        return {
            right: leftRight,
            far: true
        }
    }
}

// Finds the distance between 2 points
export function pythag(keypoint1, keypoint2) {
    const xdiff = keypoint1.x - keypoint2.x;
    const ydiff = keypoint1.y - keypoint2.y;
    return Math.sqrt(xdiff*xdiff + ydiff*ydiff);
}

// Checks the angle formed at the vertex
export function calculateAngle(point1, vertex, point2) {
    const a = pythag(point1, vertex);
    const b = pythag(vertex, point2);
    const c = pythag(point1,point2);

    return Math.round(Math.acos((a*a + b*b - c*c) / (2*a*b)) * 180 / 3.1415);
}

// Boolean function to check if it is near the target degrees
export function pushupAngle(keypoints, target, tolerance = 15, right = 0) {
    const angle = calculateAngle(keypoints[c.left_wrist], keypoints[c.left_elbow + right], keypoints[c.left_shoulder]);
    return (target-tolerance <= angle) && (angle <= target + tolerance);
}

// returns true if back straight, false if it exceeds threshold
export function checkBackStraight(keypoints, threshold = 0.3, tolerance = 0.3, right = 0) {
    // Really brute force method until I think of a better way
    const { x: ax, y:ay } = keypoints[c.left_ankle + right];
    const { x: kx, y:ky } = keypoints[c.left_knee + right];
    const { x: hx, y:hy } = keypoints[c.left_hip + right];
    const { x: sx, y:sy } = keypoints[c.left_shoulder + right];

    let slope1 = (ky - ay) / (kx - ax); // knee-ankle
    let slope2 = (hy - ky) / (hx - kx); // knee-ankle
    let slope3 = (sy - hy) / (sx - hx); // knee-ankle

    const slopeDifference1 = Math.abs(slope1 - slope2);
    const slopeDifference2 = Math.abs(slope2 - slope3);

    return slopeDifference1 <= tolerance && slopeDifference2 <= tolerance;
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