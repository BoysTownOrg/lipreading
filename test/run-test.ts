import assert from "assert";
import { runTest, Button, Result, Trials, TimeStamp } from "../run-test";

class ButtonStub implements Button {
  shown: boolean;
  hidden: boolean;
  onClick: () => void;

  constructor() {
    this.shown = false;
    this.hidden = false;
    this.onClick = () => { };
  }

  setOnClick(f: () => void) {
    this.onClick = f;
  }

  show() {
    this.shown = true;
  }

  hide() {
    this.hidden = true;
  }
}

class TrialsStub implements Trials {
  nextRun: boolean;
  hasCompleted: boolean;
  onNextCompletion: (_: Result) => void;

  constructor() {
    this.nextRun = false;
    this.hasCompleted = false;
    this.onNextCompletion = () => { };
  }

  runNext() {
    this.nextRun = true;
  }

  setOnNextCompletion(f: (_: Result) => void) {
    this.onNextCompletion = f;
  }

  completed() {
    return this.hasCompleted;
  }
}

class TimeStampStub implements TimeStamp {
  nowMilliseconds_: number;

  constructor() {
    this.nowMilliseconds_ = -1;
  }

  nowMilliseconds() {
    return this.nowMilliseconds_;
  }

  setNowMilliseconds(ms: number) {
    this.nowMilliseconds_ = ms;
  }
}

function assertEqualTrialResult(actual: Result, expected: Result) {
  assert.equal(actual.selectedImageUrl, expected.selectedImageUrl);
  assert.equal(
    actual.elapsedTimeMilliseconds,
    expected.elapsedTimeMilliseconds
  );
}

function assertEqualTrialResults(actual: Result[], expected: Result[]) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assertEqualTrialResult(actual[i], expected[i]);
}

function test(assertion: (startButton: ButtonStub, trials: TrialsStub, continueButton: ButtonStub, timeStamp: TimeStampStub) => void, onFinished: (_: Result[]) => void = () => { }) {
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
      trials.onNextCompletion({
        selectedImageUrl: "",
        videoUrl: ""
      });
      assert.equal(continueButton.shown, true);
    });
  });

  it("does not show the continue button when final trial completes", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      assert.equal(continueButton.shown, false);
      trials.hasCompleted = true;
      trials.onNextCompletion({
        selectedImageUrl: "",
        videoUrl: ""
      });
      assert.equal(continueButton.shown, false);
    });
  });

  it("runs next trial when continue button touched", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      trials.onNextCompletion({
        selectedImageUrl: "",
        videoUrl: ""
      });
      trials.nextRun = false;
      continueButton.onClick();
      assert.equal(trials.nextRun, true);
    });
  });

  it("hides continue button when touched", () => {
    test((startButton, trials, continueButton) => {
      startButton.onClick();
      trials.onNextCompletion({
        selectedImageUrl: "",
        videoUrl: ""
      });
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
        trials.onNextCompletion({
          selectedImageUrl: "",
          videoUrl: ""
        });
        assert.equal(finished, true);
      },
      () => (finished = true)
    );
  });

  it("passes trial results to completion handler", () => {
    let results: Result[] = [];
    test(
      (startButton, trials, _continueButton, timeStamp) => {
        timeStamp.setNowMilliseconds(2);
        startButton.onClick();
        timeStamp.setNowMilliseconds(7);
        trials.onNextCompletion({ selectedImageUrl: "a", videoUrl: "b" });
        timeStamp.setNowMilliseconds(23);
        trials.onNextCompletion({ selectedImageUrl: "g", videoUrl: "h" });
        timeStamp.setNowMilliseconds(67);
        trials.hasCompleted = true;
        trials.onNextCompletion({ selectedImageUrl: "e", videoUrl: "f" });
        assertEqualTrialResults(results, [
          { selectedImageUrl: "a", videoUrl: "b", elapsedTimeMilliseconds: 7 - 2 },
          { selectedImageUrl: "g", videoUrl: "h", elapsedTimeMilliseconds: 23 - 2 },
          { selectedImageUrl: "e", videoUrl: "f", elapsedTimeMilliseconds: 67 - 2 },
        ]);
      },
      (r) => (results = r)
    );
  });
});
