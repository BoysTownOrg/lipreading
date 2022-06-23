export function runTest(startButton, trials, continueButton) {
  trials.setOnNextCompletion(() => {
    continueButton.show();
  });
  continueButton.setOnClick(() => {
    trials.runNext();
  });
  startButton.setOnClick(() => {
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}
