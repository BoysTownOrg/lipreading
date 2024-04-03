export interface Stimuli {
  load(url: string, onFinished: () => void): void;
}

export interface ProgressBar {
  update(widthPercent: number): void;
  show(): void;
  hide(): void;
}

export function preloadStimuli(stimuli: Stimuli, progressBar: ProgressBar, urls: string[], onFinished: () => void) {
  progressBar.show();
  progressBar.update(0);
  let completed = 0;
  urls.forEach((url) =>
    stimuli.load(url, () => {
      progressBar.update(((completed + 1) * 100) / urls.length);
      completed += 1;
      if (completed === urls.length) {
        progressBar.hide();
        onFinished();
      }
    })
  );
}
