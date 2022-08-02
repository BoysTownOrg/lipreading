import { parseTrials } from "../parse-trials.js";
import { preloadStimuli } from "../preload-stimuli.js";
import { runTest } from "../run-test.js";
import { runTrial } from "../run-trial.js";
import { uniqueUrls } from "../unique-urls.js";

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
  constructor(trials, videoUrl) {
    this.trials = trials;
    this.videoUrl = videoUrl;
  }

  call(selectedImageUrl) {
    this.trials.onNextCompletion({
      selectedImageUrl,
      videoUrl: this.videoUrl,
    });
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
    this.videoElement.pause();
    setTimeout(() => this.videoElement.play(), 1000);
  }

  show() {
    showElement(this.videoElement);
  }

  hide() {
    hideElement(this.videoElement);
  }
}

class Images {
  constructor(imageContainers, imageElementsWithUrls, stimuli) {
    this.imageContainers = imageContainers;
    this.imageElementsWithUrls = imageElementsWithUrls;
    this.imageElementsWithUrls.forEach((imageElementWithUrl) => {
      imageElementWithUrl.element.src =
        stimuli.objectURLs[imageElementWithUrl.url];
    });
  }

  setOnTouch(f) {
    this.imageElementsWithUrls.forEach(
      (imageElementWithUrl) =>
        (imageElementWithUrl.element.onclick = () => f(imageElementWithUrl.url))
    );
  }

  show() {
    this.imageContainers.forEach((element) => showElement(element));
  }

  hide() {
    this.imageContainers.forEach((element) => hideElement(element));
  }
}

class Trials {
  constructor(
    imageContainers,
    topLeftImage,
    topRightImage,
    bottomLeftImage,
    bottomRightImage,
    videoElement,
    stimuli,
    trials
  ) {
    this.imageContainers = imageContainers;
    this.topLeftImage = topLeftImage;
    this.topRightImage = topRightImage;
    this.bottomLeftImage = bottomLeftImage;
    this.bottomRightImage = bottomRightImage;
    this.videoElement = videoElement;
    this.stimuli = stimuli;
    this.trials = trials;
    this.onNextCompletion = () => {};
  }

  runNext() {
    const trial = this.trials.shift();
    this.videoElement.src = this.stimuli.objectURLs[trial.url.video];
    this.videoElement.muted = trial.muted;
    runTrial(
      new Video(this.videoElement),
      new Images(
        this.imageContainers,
        [
          { element: this.topLeftImage, url: trial.url.image.topLeft },
          { element: this.topRightImage, url: trial.url.image.topRight },
          { element: this.bottomLeftImage, url: trial.url.image.bottomLeft },
          { element: this.bottomRightImage, url: trial.url.image.bottomRight },
        ],
        this.stimuli
      ),
      new TrialCompletionHandler(this, trial.url.video)
    );
  }

  setOnNextCompletion(f) {
    this.onNextCompletion = f;
  }

  completed() {
    return this.trials.length === 0;
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

class PerformanceTimeStamp {
  nowMilliseconds() {
    return performance.now();
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
  centerElementAtPercentage(image, 50, 50);
  image.style.maxWidth = percentString(95);
  image.style.maxHeight = percentString(95);
  return image;
}

function quadrantDiv() {
  const div = document.createElement("div");
  fixElementPosition(div);
  div.style.width = percentString(50);
  div.style.height = percentString(50);
  div.style.border = "1px solid black";
  hideElement(div);
  return div;
}

function lowerRightButton(text) {
  const button = document.createElement("button");
  fixElementPosition(button);
  centerElementAtPercentage(button, 90, 90);
  hideElement(button);
  button.textContent = text;
  button.style.width = "12%";
  button.style.height = "8%";
  button.style.fontSize = "20px";
  return button;
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

const topLeftQuadrant = quadrantDiv();
centerElementAtPercentage(topLeftQuadrant, 25, 25);
const topLeftImage = quadrantImage();
topLeftQuadrant.appendChild(topLeftImage);

const topRightQuadrant = quadrantDiv();
centerElementAtPercentage(topRightQuadrant, 75, 25);
const topRightImage = quadrantImage();
topRightQuadrant.appendChild(topRightImage);

const bottomLeftQuadrant = quadrantDiv();
centerElementAtPercentage(bottomLeftQuadrant, 25, 75);
const bottomLeftImage = quadrantImage();
bottomLeftQuadrant.appendChild(bottomLeftImage);

const bottomRightQuadrant = quadrantDiv();
centerElementAtPercentage(bottomRightQuadrant, 75, 75);
const bottomRightImage = quadrantImage();
bottomRightQuadrant.appendChild(bottomRightImage);

const videoElement = document.createElement("video");
videoElement.style.width = percentString(75);
videoElement.style.height = percentString(75);
fixElementPosition(videoElement);
centerElementAtPercentage(videoElement, 50, 50);
hideElement(videoElement);

const startButtonElement = lowerRightButton("Start");
const continueButtonElement = lowerRightButton("Continue");

document.body.appendChild(topLeftQuadrant);
document.body.appendChild(topRightQuadrant);
document.body.appendChild(bottomLeftQuadrant);
document.body.appendChild(bottomRightQuadrant);
document.body.appendChild(videoElement);
document.body.appendChild(startButtonElement);
document.body.appendChild(continueButtonElement);
document.body.appendChild(barContainingElement);

const stimuli = new Resources();
jatos.onLoad(() => {
  fetch("trials.txt")
    .then((p) => p.text())
    .then((text) => {
      const trials = parseTrials(text);
      preloadStimuli(
        stimuli,
        new ProgressBar(barContainingElement, barElement),
        uniqueUrls(trials),
        () =>
          runTest(
            new Button(startButtonElement),
            new Trials(
              [
                topLeftQuadrant,
                topRightQuadrant,
                bottomLeftQuadrant,
                bottomRightQuadrant,
              ],
              topLeftImage,
              topRightImage,
              bottomLeftImage,
              bottomRightImage,
              videoElement,
              stimuli,
              trials
            ),
            new Button(continueButtonElement),
            new PerformanceTimeStamp(),
            (results) => jatos.endStudy(results)
          )
      );
    });
});
