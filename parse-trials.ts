interface TrialImageURL {
  topLeft: string;
  topRight: string;
  bottomLeft: string;
  bottomRight: string;
}

interface TrialURL {
  image: TrialImageURL;
  video: string;
}

export enum Presentation {
  AO,
  VO,
  AV,
}

export interface Trial {
  url: TrialURL;
  presentation: Presentation;
}

export function parseTrials(text: string): Trial[] {
  let readyForImages = false;
  let videoStem = "";
  let presentation = Presentation.AV;
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
        presentation,
      });
      readyForImages = false;
    } else {
      const split = line.split(" ");
      videoStem = split[0];
      presentation = split[1] === "vo" ? Presentation.VO : Presentation.AV;
      readyForImages = true;
    }
  return trials;
}
