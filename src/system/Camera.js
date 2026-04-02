export function setupCamera(scene, target, offsetY = 0) {
  scene.cameras.main.startFollow(target, true, 0.08, 0.08);
  scene.cameras.main.setLerp(0.08, 0.08);
  scene.cameras.main.setFollowOffset(0, offsetY);
}