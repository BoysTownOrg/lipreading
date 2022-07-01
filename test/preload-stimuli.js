import assert from "assert";
import { preloadStimuli } from "../preload-stimuli.js";

class ResourcesStub {
  constructor() {
    this.urls = [];
    this.onFinishedLoadings = [];
  }

  load(url, onFinished) {
    this.urls.push(url);
    this.onFinishedLoadings.push(onFinished);
  }
}

class ProgressBarStub {
  constructor() {
    this.widthPercent = -1;
    this.shown = false;
    this.hidden = false;
  }

  update(widthPercent) {
    this.widthPercent = widthPercent;
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.hidden = true;
  }
}

function test(urls, assertion) {
  const stimuli = new ResourcesStub();
  const progressBar = new ProgressBarStub();
  preloadStimuli(stimuli, progressBar, urls);
  assertion(stimuli, progressBar);
}

describe("preloadStimuli()", () => {
  it("should show initial progress bar", () => {
    test(["a.png", "b.mov", "c.jpg"], (stimuli, progressBar) => {
      assert.equal(progressBar.shown, true);
      assert.equal(progressBar.widthPercent, 0);
    });
  });

  it("should load urls", () => {
    test(["a.png", "b.mov", "c.jpg"], (stimuli) => {
      assert.equal(stimuli.urls[0], "a.png");
      assert.equal(stimuli.urls[1], "b.mov");
      assert.equal(stimuli.urls[2], "c.jpg");
    });
  });

  it("should progressively update progress bar", () => {
    test(["a.png", "b.mov", "c.jpg"], (stimuli, progressBar) => {
      stimuli.onFinishedLoadings[0]();
      assert.equal(progressBar.widthPercent, 100 / 3);
      stimuli.onFinishedLoadings[1]();
      assert.equal(progressBar.widthPercent, 200 / 3);
      stimuli.onFinishedLoadings[2]();
      assert.equal(progressBar.widthPercent, 100);
    });
  });

  it("should hide progress bar once finished", () => {
    test(["a.png", "b.mov", "c.jpg"], (stimuli, progressBar) => {
      stimuli.onFinishedLoadings[0]();
      stimuli.onFinishedLoadings[1]();
      assert.equal(progressBar.hidden, false);
      stimuli.onFinishedLoadings[2]();
      assert.equal(progressBar.hidden, true);
    });
  });
});
