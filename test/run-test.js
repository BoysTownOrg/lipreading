import assert from "assert";

function runTest(startButton) {
  startButton.setOnClick(() => startButton.hide());
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

describe("runTest()", () => {
  it("should show start button", () => {
    const startButton = new ButtonStub();
    runTest(startButton);
    assert.equal(startButton.shown, true);
  });

  it("should hide start button when touched", () => {
    const startButton = new ButtonStub();
    runTest(startButton);
    assert.equal(startButton.hidden, false);
    startButton.onClick();
    assert.equal(startButton.hidden, true);
  });
});
