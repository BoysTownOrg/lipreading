function runTrial(videoPlayer, images) {
  videoPlayer.setOnFinish(() => {
    videoPlayer.hide();
    images.show();
  });
  videoPlayer.show();
  videoPlayer.play();
}

import assert from "assert";

class VideoStub {
  constructor() {
    this.played = false;
    this.hidden = false;
    this.shown = false;
    this.onFinish = () => {};
  }

  setOnFinish(f) {
    this.onFinish = f;
  }

  play() {
    this.played = true;
  }

  show() {
    this.shown = true;
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

function test(assertion) {
  const video = new VideoStub();
  const images = new ImagesStub();
  runTrial(video, images);
  assertion(video, images);
}

describe("runTrial()", () => {
  it("should show the video", () => {
    test((video) => {
      assert.equal(video.shown, true);
    });
  });

  it("should play the video", () => {
    test((video) => {
      assert.equal(video.played, true);
    });
  });

  it("should hide the video when finished", () => {
    test((video) => {
      assert.equal(video.hidden, false);
      video.onFinish();
      assert.equal(video.hidden, true);
    });
  });

  it("should show the images when video finished", () => {
    test((video, images) => {
      assert.equal(images.shown, false);
      video.onFinish();
      assert.equal(images.shown, true);
    });
  });
});
