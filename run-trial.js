export function runTrial(video, images) {
  video.setOnFinish(() => {
    video.hide();
    images.setOnTouch(() => {
      images.hide();
    });
    images.show();
  });
  video.show();
  video.play();
}
