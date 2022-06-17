function runTrial(videoPlayer) {
  videoPlayer.play();
}

import assert from "assert";

class VideoPlayerStub {
  constructor() {
    this.played = false;
  }

  play() {
    this.played = true;
  }
}

describe("runTrial()", () => {
  it("should play the video", () => {
    const videoPlayer = new VideoPlayerStub();
    runTrial(videoPlayer);
    assert.equal(videoPlayer.played, true);
  });
});
