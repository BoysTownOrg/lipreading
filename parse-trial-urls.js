export function parseTrialUrls(text) {
  let readyForImages = false;
  let videoStem = "";
  const trialUrls = [];
  for (const line of text.split("\n"))
    if (readyForImages) {
      const imageStems = line.split(" ");
      trialUrls.push({
        image: {
          topLeft: `${imageStems[0]}.jpg`,
          topRight: `${imageStems[1]}.jpg`,
          bottomLeft: `${imageStems[2]}.jpg`,
          bottomRight: `${imageStems[3]}.jpg`,
        },
        video: `${videoStem}.mp4`,
      });
      readyForImages = false;
    } else {
      videoStem = line;
      readyForImages = true;
    }
  return trialUrls;
}
