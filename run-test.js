export function runTest(startButton, trials) {
  startButton.setOnClick(() => {
    startButton.hide();
    trials.runNext();
  });
  startButton.show();
}
