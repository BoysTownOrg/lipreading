function runTrial(videoPlayer) {
  videoPlayer.setOnFinish(() => {
    videoPlayer.hide();
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

describe("runTrial()", () => {
  it("should play the video", () => {
    const videoPlayer = new VideoPlayerStub();
    runTrial(videoPlayer);
    assert.equal(videoPlayer.played, true);
  });

  it("should hide the video when finished", () => {
    const videoPlayer = new VideoPlayerStub();
    runTrial(videoPlayer);
    assert.equal(videoPlayer.hidden, false);
    videoPlayer.onFinish();
    assert.equal(videoPlayer.hidden, true);
  });
});
