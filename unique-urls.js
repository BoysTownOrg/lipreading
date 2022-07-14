export function uniqueUrls(trialUrls) {
  const unique = new Set();
  trialUrls.forEach((urls) => {
    unique.add(urls.image.topLeft);
    unique.add(urls.image.topRight);
    unique.add(urls.image.bottomLeft);
    unique.add(urls.image.bottomRight);
    unique.add(urls.video);
  });
  return [...unique].sort();
}
