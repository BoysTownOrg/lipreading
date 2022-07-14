export function runTrial(video, images, completionHandler) {
  images.setOnTouch((imageId) => {
    images.hide();
    completionHandler.call(imageId);
  });
  video.setOnFinish(() => {
    video.hide();
    images.show();
  });
  video.show();
  video.play();
}
