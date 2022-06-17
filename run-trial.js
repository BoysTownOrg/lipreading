export function runTrial(videoPlayer, images) {
  videoPlayer.setOnFinish(() => {
    videoPlayer.hide();
    images.show();
  });
  videoPlayer.show();
  videoPlayer.play();
}
