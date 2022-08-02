export function parseTrials(text) {
  let readyForImages = false;
  let videoStem = "";
  let muted = false;
  const trials = [];
  for (const line of text.split("\n"))
    if (readyForImages) {
      const imageStems = line.split(" ");
      trials.push({
        url: {
          image: {
            topLeft: `${imageStems[0]}`,
            topRight: `${imageStems[1]}`,
            bottomLeft: `${imageStems[2]}`,
            bottomRight: `${imageStems[3]}`,
          },
          video: `${videoStem}`,
        },
        muted,
      });
      readyForImages = false;
    } else {
      const split = line.split(" ");
      videoStem = split[0];
      muted = split[1] === "vo";
      readyForImages = true;
    }
  return trials;
}
