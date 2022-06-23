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
    this.onNextCompletion = () => {};
  }

  runNext() {
    this.nextRun = true;
  }

  setOnNextCompletion(f) {
    this.onNextCompletion = f;
  }
}

function test(assertion) {
  const startButton = new ButtonStub();
  const trials = new TrialsStub();
  runTest(startButton, trials);
  assertion(startButton, trials);
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

  it("runs next trial when trial completes", () => {
    test((startButton, trials) => {
      startButton.onClick();
      trials.nextRun = false;
      trials.onNextCompletion();
      assert.equal(trials.nextRun, true);
    });
  });
});
