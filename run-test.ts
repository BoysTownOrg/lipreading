export interface Button {
  setOnClick(f: () => void): void;
  hide(): void;
  show(): void;
}

export interface TimeStamp {
  nowMilliseconds(): number;
}

export interface Trials {
  runNext(): void;
  completed(): boolean;
  setOnNextCompletion(f: (result: Result) => void): void;
}

export interface Result {
  selectedImageUrl: string;
  videoUrl: string;
  elapsedTimeMilliseconds?: number;
}

export function runTest(
  startButton: Button,
  trials: Trials,
  continueButton: Button,
  timeStamp: TimeStamp,
  onFinished: (results: Result[]) => void
) {
  const results: Result[] = [];
  let startTimeMilliseconds = 0;
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
