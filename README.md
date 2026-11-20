# ShotLab: Browser Pose Basketball

ShotLab is a camera-controlled basketball shooting simulator hosted on GitHub Pages. It uses MediaPipe Pose Landmarker Lite to estimate a basketball shot from the shoulder, elbow, and wrist. The ball travels through a stylized 2D physics simulation. No controller, API key, or backend is required.

## Play on GitHub Pages

1. Open https://aaron-ragsdale.github.io/shotmaker/ in Chrome or Safari.
2. Choose Standard (Mac) or Smooth (iPad), and GPU or CPU, before enabling the camera.
3. Press **Enable camera** and allow camera access. Stand back so your shoulder, elbow, and wrist remain visible.
4. Choose your shooting arm. Bend the elbow to load the shot, then extend upward quickly to release it.
5. Adjust sensitivity if shots are too difficult or too easy to trigger.
6. Watch the shot, track makes and attempts, and download CSV session data if needed. Use Demo shot to test the court without your camera.

## Deploy updates

In GitHub, open the `aaron-ragsdale/shotmaker` repository, replace the **root** `index.html` and `README.md` with the two files in this archive, and commit to `main`. GitHub Pages serves the `index.html` at the repository root (assuming Pages is configured for that branch/root). Reload the published URL after deployment.

## How it works

- MediaPipe Pose Landmarker Lite supplies 33 body landmarks. The game tracks the shooting-side shoulder, elbow, and wrist.
- A bent elbow indicates load. Elbow extension plus upward wrist movement indicates a shot release.
- Estimated release angle and strength control a simulated ball trajectory. This is an arcade approximation, not a physical measurement of an actual ball.
- Exponential smoothing reduces landmark jitter; the tracking selector adjusts the pose inference interval.
- A made shot occurs when the descending ball crosses the simulated rim scoring window.
- CSV export includes shot results and estimated movement metrics.

## MediaPipe / CSP troubleshooting

- This version uses the same MediaPipe browser import as the working REACH! game: `@mediapipe/tasks-vision@0.10.21/vision_bundle.mjs`, and its matching `/wasm` directory.
- If you still see an `unsafe-eval` or `script-src` error, open Chrome DevTools > Console and identify the exact script URL and CSP directive in the error. An `unsafe-eval` violation is not automatically caused by ShotLab's own source; it can be generated inside a dependency or by a browser extension. Do not broadly enable `unsafe-eval` without identifying the source.
- If the camera fails, grant camera permission for the HTTPS GitHub Pages URL.
- If the model fails, check that `cdn.jsdelivr.net` and `storage.googleapis.com` are accessible.
- If your arm isn't visible, improve lighting or change position. If inference is slow, use Smooth mode or try CPU.

## Privacy and limitations

Camera frames are analyzed by MediaPipe locally in the browser. This application does not upload video. Model and runtime assets are fetched from public hosting. The game doesn't track a real ball, ball spin, or precise 3D release velocity.
