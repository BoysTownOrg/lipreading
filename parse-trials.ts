interface TrialImageURL {
  topLeft: string
  topRight: string
  bottomLeft: string
  bottomRight: string
}

interface TrialURL {
  image: TrialImageURL,
  video: string
}

export interface Trial {
  url: TrialURL,
  muted: boolean,
}

export function parseTrials(text: string): Trial[] {
  let readyForImages = false;
  let videoStem = "";
  let muted = false;
  const trials: Trial[] = [];
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
