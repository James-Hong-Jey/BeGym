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

// For pose detections

export function drawPoint(ctx, x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

// Draw keypoints on the canvas
export function drawKeypoints(keypoints, minConfidence = 0.3, ctx, scale = 1) {
    const color = "red";
    // 0 to 4 are face stuff, idc about that 
    for (let i = 5; i < 17; i++) {
        const keypoint = keypoints[i];
        if (keypoint.score < minConfidence) continue;
        // NOTE - I mirrored the webcam w scaleX(-1) so this is mirrored too
        // const x = keypoint.x;
        const x = 640 - keypoint.x;
        const y = keypoint.y;
        drawPoint(ctx, x * scale, y * scale, 10, color);
    }
}

export function drawSegment(ctx, [mx, my], [tx, ty], color) {
    ctx.beginPath()
    ctx.moveTo(mx, my)
    ctx.lineTo(tx, ty)
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.stroke()
}

// TODO: draw skeleton (only between arms, back and legs)

// Technical stuff
