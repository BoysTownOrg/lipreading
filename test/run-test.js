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

function assertEqualTrialResult(actual, expected) {
  assert.equal(actual.selectedImageId, expected.selectedImageId);
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
  runTest(startButton, trials, continueButton, onFinished);
  assertion(startButton, trials, continueButton);
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
      (startButton, trials) => {
        startButton.onClick();
        trials.onNextCompletion({ selectedImageId: "a" });
        trials.onNextCompletion({ selectedImageId: "g" });
        trials.hasCompleted = true;
        trials.onNextCompletion({ selectedImageId: "e" });
        assertEqualTrialResults(results, [
          { selectedImageId: "a" },
          { selectedImageId: "g" },
          { selectedImageId: "e" },
        ]);
      },
      (r) => (results = r)
    );
  });
});
