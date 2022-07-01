function preloadStimuli(stimuli, progressBar, urls) {
  urls.forEach((url) => stimuli.load(url, () => {}));
}

import assert from "assert";

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

class ProgressBarStub {}

describe("preloadStimuli()", () => {
  it("should load urls", () => {
    const stimuli = new ResourcesStub();
    const progressBar = new ProgressBarStub();
    const urls = ["a.png", "b.mov", "c.jpg"];
    preloadStimuli(stimuli, progressBar, urls);
    assert.equal(stimuli.urls[0], "a.png");
    assert.equal(stimuli.urls[1], "b.mov");
    assert.equal(stimuli.urls[2], "c.jpg");
  });
});

/*
 * fetch(url)
 * .then(response => response.blob())
 * .then(blob => {
 *   this.objectURLs[url] = URL.createObjectURL(blob);
 *   this.onLoadOne();
 * });
 */
