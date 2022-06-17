export function runTrial(videoPlayer, images) {
  videoPlayer.setOnFinish(() => {
    videoPlayer.hide();
    images.setOnTouch(() => {
      images.hide();
    });
    images.show();
  });
  videoPlayer.show();
  videoPlayer.play();
}
