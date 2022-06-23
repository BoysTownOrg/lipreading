export function runTrial(video, images, completionHandler) {
  images.setOnTouch(() => {
    images.hide();
    completionHandler.call();
  });
  video.setOnFinish(() => {
    video.hide();
    images.show();
  });
  video.show();
  video.play();
}
