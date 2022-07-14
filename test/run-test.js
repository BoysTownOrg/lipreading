import assert from "assert";
import { runTest } from "../run-test.js";

class ButtonStub {
  constructor() {
    this.shown = false;
    this.hidden = false;
    this.onClick = () => {};
  }

  setOnClick(f) {
    this.onClick = f;
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.hidden = true;
  }
}

class TrialsStub {
  constructor() {
    this.nextRun = false;
    this.hasCompleted = false;
    this.onNextCompletion = () => {};
  }

  runNext() {
    this.nextRun = true;
  }

  setOnNextCompletion(f) {
    this.onNextCompletion = f;
  }

  completed() {
    return this.hasCompleted;
  }
}

class TimeStampStub {
  constructor() {
    this.nowMilliseconds_ = -1;
  }

  nowMilliseconds() {
    return this.nowMilliseconds_;
  }

  setNowMilliseconds(ms) {
    this.nowMilliseconds_ = ms;
  }
}

function assertEqualTrialResult(actual, expected) {
  assert.equal(actual.selectedImageId, expected.selectedImageId);
  assert.equal(
    actual.elapsedTimeMilliseconds,
    expected.elapsedTimeMilliseconds
  );
}

function assertEqualTrialResults(actual, expected) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assertEqualTrialResult(actual[i], expected[i]);
}

function test(assertion, onFinished = () => {}) {
  const startButton = new ButtonStub();
  const trials = new TrialsStub();
  const continueButton = new ButtonStub();
  const timeStamp = new TimeStampStub();
  runTest(startButton, trials, continueButton, timeStamp, onFinished);
  assertion(startButton, trials, continueButton, timeStamp);
}

describe("runTest()", () => {
  it("should show start button", () => {
    test((startButton) => {
      assert.equal(startButton.shown, true);
    });
  });

  it("should hide start button when touched", () => {
    test((startButton) => {
      assert.equal(startButton.hidden, false);
      startButton.onClick();
      assert.equal(startButton.hidden, true);
    });
  });

  it("runs next trial when start button touched", () => {
    test((startButton, trials) => {
      assert.equal(trials.nextRun, false);
      startButton.onClick();
      assert.equal(trials.nextRun, true);
    });
  });

  it("shows the continue button when trial completes", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      assert.equal(continueButton.shown, false);
      trials.onNextCompletion();
      assert.equal(continueButton.shown, true);
    });
  });

  it("does not show the continue button when final trial completes", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      assert.equal(continueButton.shown, false);
      trials.hasCompleted = true;
      trials.onNextCompletion();
      assert.equal(continueButton.shown, false);
    });
  });

  it("runs next trial when continue button touched", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      trials.onNextCompletion();
      trials.nextRun = false;
      continueButton.onClick();
      assert.equal(trials.nextRun, true);
    });
  });

  it("hides continue button when touched", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      trials.onNextCompletion();
      assert.equal(continueButton.hidden, false);
      continueButton.onClick();
      assert.equal(continueButton.hidden, true);
    });
  });

  it("runs completion handler when final trial completes", () => {
    let finished = false;
    test(
      (startButton, trials) => {
        startButton.onClick();
        trials.hasCompleted = true;
        assert.equal(finished, false);
        trials.onNextCompletion();
        assert.equal(finished, true);
      },
      () => (finished = true)
    );
  });

  it("passes trial results to completion handler", () => {
    let results = null;
    test(
      (startButton, trials, continueButton, timeStamp) => {
        timeStamp.setNowMilliseconds(2);
        startButton.onClick();
        timeStamp.setNowMilliseconds(7);
        trials.onNextCompletion({ selectedImageId: "a" });
        timeStamp.setNowMilliseconds(23);
        trials.onNextCompletion({ selectedImageId: "g" });
        timeStamp.setNowMilliseconds(67);
        trials.hasCompleted = true;
        trials.onNextCompletion({ selectedImageId: "e" });
        assertEqualTrialResults(results, [
          { selectedImageId: "a", elapsedTimeMilliseconds: 7 - 2 },
          { selectedImageId: "g", elapsedTimeMilliseconds: 23 - 2 },
          { selectedImageId: "e", elapsedTimeMilliseconds: 67 - 2 },
        ]);
      },
      (r) => (results = r)
    );
  });
});
