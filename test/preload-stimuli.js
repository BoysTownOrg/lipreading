function preloadStimuli(stimuli, progressBar, urls) {
  progressBar.show();
  progressBar.update(0);
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
    this.shown = false;
  }

  update(widthPercent) {
    this.widthPercent = widthPercent;
  }

  show() {
    this.shown = true;
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
});

/*
 * fetch(url)
 * .then(response => response.blob())
 * .then(blob => {
 *   this.objectURLs[url] = URL.createObjectURL(blob);
 *   this.onLoadOne();
 * });
 */
