import assert from "assert";
import { runTrial } from "../run-trial.js";

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
    this.hidden = false;
    this.onTouch = () => {};
  }

  setOnTouch(f) {
    this.onTouch = f;
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.hidden = true;
  }
}

class HandlerStub {
  constructor() {
    this.called = false;
  }

  call() {
    this.called = true;
  }
}

function test(assertion) {
  const video = new VideoStub();
  const images = new ImagesStub();
  const completionHandler = new HandlerStub();
  runTrial(video, images, completionHandler);
  assertion(video, images, completionHandler);
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

  it("should hide the images when touched", () => {
    test((video, images) => {
      video.onFinish();
      assert.equal(images.hidden, false);
      images.onTouch();
      assert.equal(images.hidden, true);
    });
  });

  it("should notify when trial complete", () => {
    test((video, images, completionHandler) => {
      video.onFinish();
      assert.equal(completionHandler.called, false);
      images.onTouch();
      assert.equal(completionHandler.called, true);
    });
  });
});
