# ShotLab: Browser-based pose basketball simulator

ShotLab is a proof-of-concept shooting game controlled by webcam pose estimation. It uses the MediaPipe Pose Landmarker Lite model in the browser, estimates shooting gestures from shoulder/elbow/wrist landmarks, and fires a simulated basketball across a 2D court. No ball or hardware controller is required.

## Run locally

1. Download `index.html` or unzip the project.
2. In the project folder run `python3 -m http.server 8000`.
3. Open `http://localhost:8000` in Chrome or Safari, click **Enable camera**, and grant camera access.
4. Stand about 4–8 feet from the camera with your upper body and shooting arm fully visible. Select the correct shooting arm.
5. Bend your elbow, then extend upward with a quick wrist movement. A basketball will launch on the simulated court. Adjust sensitivity if needed.

`index.html` can also be hosted on GitHub Pages. Hosted pages need HTTPS for webcam access. MediaPipe JavaScript/WASM and the pretrained pose model download from public CDNs during loading; after loading, frame inference occurs in the browser and video isn't uploaded by this application.

## How it works

- Pose Landmarker detects 33 pose landmarks. For a right shooting arm the model uses right shoulder (12), elbow (14), wrist (16); for left it uses 11/13/15.
- The arm landmarks receive low-pass smoothing (EMA with alpha 0.45) to reduce jitter.
- The elbow angle is computed from the angle between shoulder-to-elbow and wrist-to-elbow vectors.
- The wrist's motion over a 160 ms history estimates upward speed and lateral velocity, in normalized image units/second.
- A shot is triggered only after elbow flexion (loaded state), followed by sufficient elbow extension and upward wrist velocity. Sensitivity changes those thresholds.
- Release speed is mapped from wrist velocity; release angle is estimated from wrist motion and forearm direction. The ball then follows a stylized parabolic path with gravity. The game registers a make when the ball crosses downward through a horizontal scoring window over the rim.

## Current limitations

This is an experimental arcade simulation, not a biomechanical validation instrument. It does not track a physical ball, distinguish full wrist flick from arm extension, measure finger release, or reconstruct a true 3D launch. Camera orientation, depth movement, background, and frame rate affect estimates. It uses coarse 2D collision detection, not physical ball-rim dynamics. If the camera is near-frontal and the shooting arm becomes occluded, a side-ish camera angle may be better.

Potential next improvements: add MediaPipe Hands for wrist/finger release, automatic calibration of velocity per user, 3D-style ball flight and improved rim collision, and download of anonymized trial metrics for research.
