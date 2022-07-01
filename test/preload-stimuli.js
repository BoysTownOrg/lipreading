function preloadStimuli(stimuli, progressBar, urls) {
  let completed = 0;
  urls.forEach((url) =>
    stimuli.load(url, () => {
      progressBar.update(((completed + 1) * 100) / urls.length);
      completed += 1;
    })
  );
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

class ProgressBarStub {
  constructor() {
    this.widthPercent = -1;
  }

  update(widthPercent) {
    this.widthPercent = widthPercent;
  }
}

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

  it("should progressively update progress bar", () => {
    const stimuli = new ResourcesStub();
    const progressBar = new ProgressBarStub();
    const urls = ["a.png", "b.mov", "c.jpg"];
    preloadStimuli(stimuli, progressBar, urls);
    stimuli.onFinishedLoadings[0]();
    assert.equal(progressBar.widthPercent, 100 / 3);
    stimuli.onFinishedLoadings[1]();
    assert.equal(progressBar.widthPercent, 200 / 3);
    stimuli.onFinishedLoadings[2]();
    assert.equal(progressBar.widthPercent, 100);
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
