export function uniqueUrls(trials) {
  const unique = new Set();
  trials.forEach((trial) => {
    unique.add(trial.url.image.topLeft);
    unique.add(trial.url.image.topRight);
    unique.add(trial.url.image.bottomLeft);
    unique.add(trial.url.image.bottomRight);
    unique.add(trial.url.video);
  });
  return [...unique].sort();
}
