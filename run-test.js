export function runTest(startButton, trials) {
  trials.setOnNextCompletion(() => {
    trials.runNext();
  });
  startButton.setOnClick(() => {
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}
