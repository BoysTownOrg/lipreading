import assert from "assert";

function runTest(startButton, trials) {
  startButton.setOnClick(() => {
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}

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
  }

  runNext() {
    this.nextRun = true;
  }
}

describe("runTest()", () => {
  it("should show start button", () => {
    const startButton = new ButtonStub();
    const trials = new TrialsStub();
    runTest(startButton, trials);
    assert.equal(startButton.shown, true);
  });

  it("should hide start button when touched", () => {
    const startButton = new ButtonStub();
    const trials = new TrialsStub();
    runTest(startButton, trials);
    assert.equal(startButton.hidden, false);
    startButton.onClick();
    assert.equal(startButton.hidden, true);
  });

  it("runs next trial when start button touched", () => {
    const startButton = new ButtonStub();
    const trials = new TrialsStub();
    runTest(startButton, trials);
    assert.equal(trials.nextRun, false);
    startButton.onClick();
    assert.equal(trials.nextRun, true);
  });
});
