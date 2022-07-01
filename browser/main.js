import { preloadStimuli } from "../preload-stimuli.js";
import { runTest } from "../run-test.js";
import { runTrial } from "../run-trial.js";

function hideElement(element) {
  element.style.visibility = "hidden";
}

function showElement(element) {
  element.style.visibility = "visible";
}

function percentString(n) {
  return `${n}%`;
}

class Resources {
  constructor() {
    this.objectURLs = {};
  }

  load(url, onFinished) {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        this.objectURLs[url] = URL.createObjectURL(blob);
        onFinished();
      });
  }
}

class ProgressBar {
  constructor(barContainingElement, barElement) {
    this.barContainingElement = barContainingElement;
    this.barElement = barElement;
  }

  update(widthPercent) {
    this.barElement.style.width = `${widthPercent}%`;
  }

  show() {
    showElement(this.barContainingElement);
    showElement(this.barElement);
  }

  hide() {
    hideElement(this.barElement);
    hideElement(this.barContainingElement);
  }
}

class TrialCompletionHandler {
  constructor(trials) {
    this.trials = trials;
  }

  call() {
    this.trials.onNextCompletion();
  }
}

class Video {
  constructor(videoElement) {
    this.videoElement = videoElement;
  }

  setOnFinish(f) {
    this.videoElement.onended = () => f();
  }

  play() {
    this.videoElement.play();
  }

  show() {
    showElement(this.videoElement);
  }

  hide() {
    hideElement(this.videoElement);
  }
}

class Images {
  constructor(imageElements) {
    this.imageElements = imageElements;
  }

  setOnTouch(f) {
    this.imageElements.forEach((element) => (element.onclick = () => f()));
  }

  show() {
    this.imageElements.forEach((element) => showElement(element));
  }

  hide() {
    this.imageElements.forEach((element) => hideElement(element));
  }
}

class Trials {
  constructor(
    topLeftImage,
    topRightImage,
    bottomLeftImage,
    bottomRightImage,
    videoElement,
    stimuli,
    urls
  ) {
    this.topLeftImage = topLeftImage;
    this.topRightImage = topRightImage;
    this.bottomLeftImage = bottomLeftImage;
    this.bottomRightImage = bottomRightImage;
    this.videoElement = videoElement;
    this.stimuli = stimuli;
    this.urls = urls;
    this.onNextCompletion = () => {};
  }

  runNext() {
    const urls = this.urls.shift();
    this.topLeftImage.src = this.stimuli.objectURLs[urls.image.topLeft];
    this.topRightImage.src = this.stimuli.objectURLs[urls.image.topRight];
    this.bottomLeftImage.src = this.stimuli.objectURLs[urls.image.bottomLeft];
    this.bottomRightImage.src = this.stimuli.objectURLs[urls.image.bottomRight];
    this.videoElement.src = this.stimuli.objectURLs[urls.video];
    runTrial(
      new Video(this.videoElement),
      new Images([
        this.topLeftImage,
        this.topRightImage,
        this.bottomLeftImage,
        this.bottomRightImage,
      ]),
      new TrialCompletionHandler(this)
    );
  }

  setOnNextCompletion(f) {
    this.onNextCompletion = f;
  }

  completed() {
    return this.urls.length === 0;
  }
}

class Button {
  constructor(buttonElement) {
    this.buttonElement = buttonElement;
  }

  setOnClick(f) {
    this.buttonElement.onclick = () => f();
  }

  show() {
    showElement(this.buttonElement);
  }

  hide() {
    hideElement(this.buttonElement);
  }
}

function centerElementAtPercentage(element, x, y) {
  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.style.transform = `translate(${percentString(-50)}, ${percentString(
    -50
  )})`;
}

function fixElementPosition(element) {
  element.style.position = "fixed";
}

function quadrantImage() {
  const image = new Image();
  fixElementPosition(image);
  image.style.maxWidth = percentString(50);
  image.style.maxHeight = percentString(50);
  hideElement(image);
  return image;
}

const barContainingElement = document.createElement("div");
barContainingElement.style.width = percentString(75);
barContainingElement.style.height = percentString(5);
barContainingElement.style.backgroundColor = "grey";
fixElementPosition(barContainingElement);
centerElementAtPercentage(barContainingElement, 50, 50);
hideElement(barContainingElement);

const barElement = document.createElement("div");
barElement.style.backgroundColor = "green";
barElement.style.height = percentString(100);
hideElement(barElement);
barContainingElement.appendChild(barElement);

const topLeftImage = quadrantImage();
centerElementAtPercentage(topLeftImage, 25, 25);

const topRightImage = quadrantImage();
centerElementAtPercentage(topRightImage, 75, 25);

const bottomLeftImage = quadrantImage();
centerElementAtPercentage(bottomLeftImage, 25, 75);

const bottomRightImage = quadrantImage();
centerElementAtPercentage(bottomRightImage, 75, 75);

const videoElement = document.createElement("video");
fixElementPosition(videoElement);
centerElementAtPercentage(videoElement, 50, 50);
hideElement(videoElement);

const startButtonElement = document.createElement("button");
fixElementPosition(startButtonElement);
centerElementAtPercentage(startButtonElement, 50, 50);
hideElement(startButtonElement);
startButtonElement.textContent = "start";

const continueButtonElement = document.createElement("button");
fixElementPosition(continueButtonElement);
centerElementAtPercentage(continueButtonElement, 50, 50);
hideElement(continueButtonElement);
continueButtonElement.textContent = "continue";

document.body.appendChild(topLeftImage);
document.body.appendChild(topRightImage);
document.body.appendChild(bottomLeftImage);
document.body.appendChild(bottomRightImage);
document.body.appendChild(videoElement);
document.body.appendChild(startButtonElement);
document.body.appendChild(continueButtonElement);
document.body.appendChild(barContainingElement);

const stimuli = new Resources();
preloadStimuli(
  stimuli,
  new ProgressBar(barContainingElement, barElement),
  [
    "a.jpg",
    "b.jpg",
    "c.jpg",
    "d.jpg",
    "e.jpg",
    "f.jpg",
    "g.jpg",
    "h.jpg",
    "a.webm",
    "video.ogv",
  ],
  () =>
    runTest(
      new Button(startButtonElement),
      new Trials(
        topLeftImage,
        topRightImage,
        bottomLeftImage,
        bottomRightImage,
        videoElement,
        stimuli,
        [
          {
            image: {
              topLeft: "a.jpg",
              topRight: "b.jpg",
              bottomLeft: "c.jpg",
              bottomRight: "d.jpg",
            },
            video: "video.ogv",
          },
          {
            image: {
              topLeft: "e.jpg",
              topRight: "f.jpg",
              bottomLeft: "g.jpg",
              bottomRight: "h.jpg",
            },
            video: "a.webm",
          },
        ]
      ),
      new Button(continueButtonElement)
    )
);
