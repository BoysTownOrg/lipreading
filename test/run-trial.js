function runTrial(videoPlayer, images) {
  videoPlayer.setOnFinish(() => {
    videoPlayer.hide();
    images.show();
  });
  videoPlayer.play();
}

import assert from "assert";

class VideoPlayerStub {
  constructor() {
    this.played = false;
    this.hidden = false;
    this.onFinish = () => {};
  }

  setOnFinish(f) {
    this.onFinish = f;
  }

  play() {
    this.played = true;
  }

  hide() {
    this.hidden = true;
  }
}

class ImagesStub {
  constructor() {
    this.shown = false;
  }

  show() {
    this.shown = true;
  }
}

describe("runTrial()", () => {
  it("should play the video", () => {
    const videoPlayer = new VideoPlayerStub();
    const images = new ImagesStub();
    runTrial(videoPlayer, images);
    assert.equal(videoPlayer.played, true);
  });

  it("should hide the video when finished", () => {
    const videoPlayer = new VideoPlayerStub();
    const images = new ImagesStub();
    runTrial(videoPlayer, images);
    assert.equal(videoPlayer.hidden, false);
    videoPlayer.onFinish();
    assert.equal(videoPlayer.hidden, true);
  });

  it("should show the images when video finished", () => {
    const videoPlayer = new VideoPlayerStub();
    const images = new ImagesStub();
    runTrial(videoPlayer, images);
    assert.equal(images.shown, false);
    videoPlayer.onFinish();
    assert.equal(images.shown, true);
  });
});
