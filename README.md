# BeGym-5482
Orbital Project to create a Social Media Web App that can detect pushups through your webcam.

# Try it out
Just pushups:
https://begym-pushups.netlify.app/ 
(social media features have been disabled due to upkeep costs)

# Build from source instructions:

## Prerequisites
A MySQL server is required for some features, but the pushup detector does not require it

## Instructions
1. Create MySQL server and configure your settings, username, schema name and password under BeGym/backend/config/config.json in the first object
2. cd into BeGym/backend
3. run "npm start"
4. server should be running on 8080 with console message "Connected to backend!"
5. cd into BeGym/frontend
6. run "npm start"
7. Frontend should be running on 3000
8. Open localhost:3000 and attempt the various features

## Instructions for Pushup Detector
1. You can configure some global tolerances (i.e. detection tolerance, back straight tolerance, etc) under BeGym/frontend/Components/Pushup-Detector/poseDetector.js
2. Navigate to "My Gym" on localhost:3000
3. Ensure that all 4 limbs are visible once the detector loads
4. Ensure that your arms are at a strict 90 degrees when they're down (your arms are typically at a greater angle)

# Contact Us
Message @jeysiao on telegram for questions and suggestions and help (will be greatly apprecated)
