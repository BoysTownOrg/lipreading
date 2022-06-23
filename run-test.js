export function runTest(startButton, trials, continueButton) {
  trials.setOnNextCompletion(() => {
    continueButton.show();
    trials.runNext();
  });
  startButton.setOnClick(() => {
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}