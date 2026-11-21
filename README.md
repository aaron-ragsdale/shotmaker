# ShotMaker POV Arcade

ShotMaker POV Arcade is a webcam-controlled basketball shooting game hosted on GitHub Pages. It uses MediaPipe Pose Landmarker Lite for upper-body motion and an optional MediaPipe Hand Landmarker for wrist and palm/MCP tracking. A front-facing hoop and synchronized side-view trajectory show the same simulated basketball.

## Play

Open https://aaron-ragsdale.github.io/shotmaker/ in Chrome or Safari and grant camera permission.

1. Select **Standard (Mac)** or **Smooth (iPad)** and GPU/CPU before enabling the camera.
2. Enable the camera. The app loads the pose model and, if **Hand tracking** is checked, also attempts to load the hand model. If hands aren't available, pose wrists are used automatically.
3. Select your right or left shooting arm. Keep the full shoulder, elbow, wrist, and hand in view.
4. Bend your elbow slightly, then extend your arm and move your wrist upward. The detector allows a brief window for the release gesture, so a shallow bend still launches a shot. A deeper bend provides more distance.
5. Watch the **Aim** readout before releasing. Moving the hand/forearm sideways shifts the ball left or right. The first-person court visibly shows the sideways flight.
6. Start in **Arcade (gentle aim)** for forgiving side accuracy, then switch to **Form challenge (strong aim)** for larger left/right effects.
7. Graze the rim and the ball rebounds outward. Clean shots pass through. Download the CSV to examine shot metrics.

## Movement recognition

- The shooting-side shoulder, elbow, and wrist (pose landmarks) establish the arm angle and load/extension gesture.
- When enabled and visible, the **Hand Landmarker** refines hand position using the wrist (landmark 0) and middle-finger MCP joint (landmark 9). The app chooses the detected hand nearest the selected pose wrist.
- Shoulder/elbow alignment and lateral palm movement estimate left/right aim. The camera feed is mirrored, so the mapping is inverted to match the player's on-screen direction.
- **Both difficulty modes support lateral aim.** Arcade scales it down; Form challenge strengthens it. A live readout shows the aim direction and pixel offset, and an in-game AIM indicator reflects it.
- The shot speed is calibrated to hoop distance and release angle. Elbow-bend depth changes the range, and the wrist flick has a modest effect.
- The front-facing court and side trajectory use one simulated ball with shared longitudinal and sideways motion.

## Rim bounce and scoring

- On descending through rim height, a centered shot within the clean scoring zone is counted as made.
- Shots near the rim edge collide and rebound upward/away, with sideways ricochet when appropriate. They are recorded as misses once they fall away.
- Shots outside the rim area miss without a bounce. These are intentionally stylized arcade collisions, not a full 3D ball-and-ring rigid-body solver.

## CSV data

Each attempt includes timestamp, arm, mode, release angle, estimated power, load elbow angle, lateral aim offset, elbow angle, wrist speed, and result. A shot that bounces out is saved as a miss.

## GitHub Pages deployment

Upload `index.html` and `README.md` to the repository root of `aaron-ragsdale/shotmaker` on the published branch. The game is at https://aaron-ragsdale.github.io/shotmaker/ . No localhost server, Python, or API key is required.

## Troubleshooting

- If shots are hard to trigger, choose High sensitivity and keep the entire shooting arm visible.
- If the hand model is slow or fails to initialize, disable **Hand tracking** and re-enable the camera; the pose-based shooting mechanic still works.
- If you don't see left/right aim, move your palm intentionally to either side while the arm extends and watch the live AIM readout. Ensure the correct shooting arm is selected.
- Model files load from `cdn.jsdelivr.net` and `storage.googleapis.com`. The browser needs internet access for the runtime/model files.
- If the browser reports CSP `unsafe-eval`, check the exact script/extension named in the Console rather than blindly enabling it.

## Privacy and limitations

Camera frames and MediaPipe inference stay in the browser; the app does not upload video. A single RGB camera only estimates 2D projected alignment and does not measure the physical basketball, actual release direction, wrist spin, or validated shooting biomechanics. Hand occlusion, camera position, and perspective affect the alignment estimate.

## Hand landmarks and left/right aiming (visual fix)

- The camera overlay now renders the full **21-point MediaPipe hand skeleton**, with finger connections, when the selected shooting hand is detected. A **Hand landmarks** readout reports whether any hands were detected. If the hand cannot be detected, the shooting game continues with pose-wrist tracking.
- The **Horizontal aim** readout now remains numeric instead of being replaced with a generic difficulty label.
- A dashed **aim projection and target marker** show the intended left/right placement directly over the POV hoop while you are loading a shot.
- The side trajectory remains an elevation/profile view. A small **top-down aim strip** at the bottom of that panel separately shows horizontal deviation. The main POV ball also shifts visibly to the left or right.
- Use **Demo Center**, **Demo Left**, and **Demo Right** to verify the three trajectories before testing live gestures. These demos do not require a camera.
- In Arcade mode, aim is forgiving. In Form Challenge, arm lean and sideways hand travel have a stronger effect. The left/right estimation is a game mechanic rather than a validated measure of shooting form.
