import { preloadStimuli } from "../preload-stimuli.js";
import { runTest } from "../run-test.js";
import { runTrial } from "../run-trial.js";

function hideElement(element) {
  element.style.visibility = "hidden";
}

function showElement(element) {
  element.style.visibility = "visible";
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

class Trials {
  constructor(video, images) {
    this.video = video;
    this.images = images;
    this.onNextCompletion = () => {};
  }

  runNext() {
    runTrial(this.video, this.images, new TrialCompletionHandler(this));
  }

  setOnNextCompletion(f) {
    this.onNextCompletion = f;
  }
}

class Button {
  constructor(buttonElement) {
    this.buttonElement = buttonElement;
  }

  setOnClick(f) {
    this.buttonElement.onclick = () => {
      f();
    };
  }

  show() {
    showElement(this.buttonElement);
  }

  hide() {
    hideElement(this.buttonElement);
  }
}

class Video {
  constructor(videoElement) {
    this.videoElement = videoElement;
  }

  setOnFinish(f) {
    this.videoElement.onended = () => {
      f();
    };
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
    this.imageElements.forEach((element) => {
      element.onclick = () => {
        f();
      };
    });
  }

  show() {
    this.imageElements.forEach((element) => showElement(element));
  }

  hide() {
    this.imageElements.forEach((element) => hideElement(element));
  }
}

function centerElementAtPercentage(element, x, y) {
  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.style.transform = "translate(-50%, -50%)";
}

function fixElementPosition(element) {
  element.style.position = "fixed";
}

function quadrantImage() {
  const image = new Image();
  fixElementPosition(image);
  image.style.maxWidth = "50%";
  image.style.maxHeight = "50%";
  hideElement(image);
  return image;
}

const barContainingElement = document.createElement("div");
barContainingElement.style.width = "75%";
barContainingElement.style.backgroundColor = "grey";
hideElement(barContainingElement);

const barElement = document.createElement("div");
barElement.style.backgroundColor = "green";
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

topLeftImage.src = "a.jpg";
topRightImage.src = "b.jpg";
bottomLeftImage.src = "c.jpg";
bottomRightImage.src = "d.jpg";

const videoElement = document.createElement("video");
fixElementPosition(videoElement);
centerElementAtPercentage(videoElement, 50, 50);
hideElement(videoElement);
videoElement.src = "video.ogv";

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

const progressBar = new ProgressBar(barContainingElement, barElement);
const stimuli = new Resources();
preloadStimuli(stimuli, progressBar, [
  "a.jpg",
  "b.jpg",
  "c.jpg",
  "d.jpg",
  "movie.ogv",
]);
const video = new Video(videoElement);
const images = new Images([
  topLeftImage,
  topRightImage,
  bottomLeftImage,
  bottomRightImage,
]);
const trials = new Trials(video, images);
const startButton = new Button(startButtonElement);
const continueButton = new Button(continueButtonElement);
runTest(startButton, trials, continueButton);
