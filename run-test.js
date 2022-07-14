export function runTest(startButton, trials, continueButton, onFinished) {
  const results = [];
  trials.setOnNextCompletion((result) => {
    results.push(result);
    if (trials.completed()) onFinished(results);
    else continueButton.show();
  });
  continueButton.setOnClick(() => {
    continueButton.hide();
    trials.runNext();
  });
  startButton.setOnClick(() => {
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}
