# ShotMaker POV Arcade

ShotMaker POV Arcade is a basketball shooting game made for **GitHub Pages**. It uses MediaPipe Pose Landmarker Lite to track the shooting-side shoulder, elbow, and wrist. A shooting gesture launches a simulated basketball toward a **front-facing hoop**, while an inset **side-view trajectory** shows the exact same simulated flight from the side.

## Play

1. Open https://aaron-ragsdale.github.io/shotmaker/ in a browser.
2. Select **Standard (Mac)** or **Smooth (iPad)** and GPU or CPU before enabling the camera.
3. Select the shooting arm and enable the camera. Allow camera permission when asked.
4. Stand far enough away for your shoulder, elbow, and wrist to stay visible. A slightly side-on shooting stance may help the arm landmarks remain visible.
5. Bend your shooting elbow to load, then extend upward quickly to release.
6. Watch the basketball fly toward the rim in the **main POV display**, while the side inset shows its flight arc. Track makes, attempts, accuracy, and streak.
7. Use **Demo shot** to test the court without the camera. **Download CSV** exports shot metrics.

## How the two views work

- The simulation maintains one 2D ball state with position, velocity, and gravity.
- The **side view** directly graphs this physics path.
- The **POV view** renders the same ball state using an intentionally stylized front-camera projection: the ball moves toward the screen-center basket and shrinks with distance.
- Scoring is determined by crossing the rim's window in the side-view physics. Both displays therefore show the same outcome.
- This is an **arcade simulation**, not a camera-calibrated 3D reconstruction of a real basketball shot. Horizontal left/right aim is not yet modeled.

## Deploy to GitHub Pages

Replace the `index.html` and `README.md` in the **root** of the [shotmaker repository](https://github.com/aaron-ragsdale/shotmaker), commit to `main`, and visit https://aaron-ragsdale.github.io/shotmaker/ when GitHub Pages has deployed the commit. No localhost, Python server, build step, backend, API key, or paid hosting is required.

## Tracking and performance

- Uses MediaPipe Tasks Vision `0.10.21` with `vision_bundle.mjs` and matching WASM assets, following the working REACH! game's loading approach.
- Detects loading and release from elbow angle and upward wrist speed.
- Smooths landmarks for more stable tracking.
- Supports adjustable sensitivity, tracking interval, shooting arm, GPU/CPU selection, full-screen view, and optional pose overlay.
- If a `script-src` or `unsafe-eval` error appears, inspect the actual Console stack and script URL. Do not add `unsafe-eval` indiscriminately.

## Privacy and limitations

Camera frames are processed locally in the browser and are not uploaded by this app. MediaPipe code, runtime files and model weights download from public hosts. The app does not detect a physical ball, real-world spin or real 3D release velocity. Because the camera estimates arm motion, gameplay requires calibration and may vary with camera placement, lighting and pose-estimation frame rate.