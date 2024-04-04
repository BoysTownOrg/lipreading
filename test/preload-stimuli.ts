import assert from "assert";
import { preloadStimuli, Stimuli, ProgressBar } from "../preload-stimuli";

class ResourcesStub implements Stimuli {
  urls: string[];
  onFinishedLoadings: (() => void)[];

  constructor() {
    this.urls = [];
    this.onFinishedLoadings = [];
  }

  load(url: string, onFinished: () => void) {
    this.urls.push(url);
    this.onFinishedLoadings.push(onFinished);
  }
}

class ProgressBarStub implements ProgressBar {
  widthPercent: number;
  shown: boolean;
  hidden: boolean;

  constructor() {
    this.widthPercent = -1;
    this.shown = false;
    this.hidden = false;
  }

  update(widthPercent: number) {
    this.widthPercent = widthPercent;
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.hidden = true;
  }
}

function test(urls: string[], assertion: (stimuli: ResourcesStub, progressBar: ProgressBarStub) => void, onFinished = () => { }) {
  const stimuli = new ResourcesStub();
  const progressBar = new ProgressBarStub();
  preloadStimuli(stimuli, progressBar, urls, onFinished);
  assertion(stimuli, progressBar);
}

describe("preloadStimuli()", () => {
  it("should show initial progress bar", () => {
    test(["a.png", "b.mov", "c.jpg"], (_stimuli, progressBar) => {
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

  it("should callback once finished", () => {
    let finished = false;
    test(
      ["a.png", "b.mov", "c.jpg"],
      (stimuli) => {
        stimuli.onFinishedLoadings[0]();
        stimuli.onFinishedLoadings[1]();
        assert.equal(finished, false);
        stimuli.onFinishedLoadings[2]();
        assert.equal(finished, true);
      },
      () => (finished = true)
    );
  });
});
