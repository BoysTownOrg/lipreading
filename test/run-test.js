import assert from "assert";

function runTest(startButton) {
  startButton.show();
}

class ButtonStub {
  constructor() {
    this.shown = false;
  }

  show() {
    this.shown = true;
  }
}

describe("runTest()", () => {
  it("should show start button", () => {
    const startButton = new ButtonStub();
    runTest(startButton);
    assert.equal(startButton.shown, true);
  });
});
