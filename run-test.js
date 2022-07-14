export function runTest(
  startButton,
  trials,
  continueButton,
  timeStamp,
  onFinished
) {
  const results = [];
  let startTimeMilliseconds = null;
  trials.setOnNextCompletion((result) => {
    results.push({
      ...result,
      elapsedTimeMilliseconds:
        timeStamp.nowMilliseconds() - startTimeMilliseconds,
    });
    if (trials.completed()) onFinished(results);
    else continueButton.show();
  });
  continueButton.setOnClick(() => {
    continueButton.hide();
    trials.runNext();
  });
  startButton.setOnClick(() => {
    startTimeMilliseconds = timeStamp.nowMilliseconds();
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}
