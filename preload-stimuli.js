export function preloadStimuli(stimuli, progressBar, urls, onFinished) {
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
