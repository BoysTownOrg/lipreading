export function runTrial(video, images, completionHandler) {
  video.setOnFinish(() => {
    video.hide();
    images.setOnTouch(() => {
      images.hide();
      completionHandler.call();
    });
    images.show();
  });
  video.show();
  video.play();
}
