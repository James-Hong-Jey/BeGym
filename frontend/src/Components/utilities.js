export const drawRect = (detections, ctx) => {
    detections.forEach(prediction=>{
        // Get Results
        const [x,y,width,height] = prediction['bbox'];
        const text = prediction['class'];

        // Styling
        const color = 'blue'
        ctx.strokeSylt = color
        ctx.font = '18px Arial'
        ctx.fillStyle = color

        // Draw Rectangles & Text
        ctx.beginPath()
        ctx.fillText(text,x,y)
        ctx.rect(x,y,width,height)
        ctx.stroke()
    })
}