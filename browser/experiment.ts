import { Presentation, parseTrials, type Trial } from "../parse-trials";
import {
  type ProgressBar,
  preloadStimuli,
  type Stimuli,
} from "../preload-stimuli";
import {
  type Button,
  type Result,
  runTest,
  type TimeStamp,
  type Trials,
} from "../run-test";
import {
  type CompletionHandler,
  type Images,
  runTrial,
  type Video,
} from "../run-trial";
import { uniqueUrls } from "../unique-urls";

function hideElement(element: HTMLElement) {
  element.style.visibility = "hidden";
}

function showElement(element: HTMLElement) {
  element.style.visibility = "visible";
}

function percentString(n: number) {
  return `${n}%`;
}

class InMemoryStimuli implements Stimuli {
  objectURLs: { [key: string]: string };

  constructor() {
    this.objectURLs = {};
  }

  load(url: string, onFinished: () => void): void {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        this.objectURLs[url] = URL.createObjectURL(blob);
        onFinished();
      });
  }
}

class UglyProgressBar implements ProgressBar {
  barContainingElement: HTMLElement;
  barElement: HTMLElement;

  constructor(barContainingElement: HTMLElement, barElement: HTMLElement) {
    this.barContainingElement = barContainingElement;
    this.barElement = barElement;
  }

  update(widthPercent: number) {
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

class TrialCompletionHandler implements CompletionHandler {
  trials: StraightforwardTrials;

  constructor(trials: StraightforwardTrials) {
    this.trials = trials;
  }

  call(selectedImageUrl: string) {
    this.trials.callback(selectedImageUrl);
  }
}

class DelayedVideo implements Video {
  videoElement: HTMLVideoElement;

  constructor(videoElement: HTMLVideoElement) {
    this.videoElement = videoElement;
  }

  setOnFinish(f: () => void) {
    this.videoElement.onended = () => f();
  }

  play() {
    // https://stackoverflow.com/a/10983845
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

class SimpleImages implements Images {
  imageContainers: HTMLElement[];
  imageElementsWithUrls: { element: HTMLImageElement; url: string }[];

  constructor(
    imageContainers: HTMLElement[],
    imageElementsWithUrls: { element: HTMLImageElement; url: string }[],
    stimuli: InMemoryStimuli,
  ) {
    this.imageContainers = imageContainers;
    this.imageElementsWithUrls = imageElementsWithUrls;
    this.imageElementsWithUrls.forEach((imageElementWithUrl) => {
      imageElementWithUrl.element.src =
        stimuli.objectURLs[imageElementWithUrl.url];
    });
  }

  setOnTouch(f: (url: string) => void) {
    this.imageElementsWithUrls.forEach(
      (imageElementWithUrl) =>
        (imageElementWithUrl.element.onclick = () =>
          f(imageElementWithUrl.url)),
    );
  }

  show() {
    this.imageContainers.forEach((element) => showElement(element));
  }

  hide() {
    this.imageContainers.forEach((element) => hideElement(element));
  }
}

class StraightforwardTrials implements Trials {
  imageContainers: HTMLElement[];
  topLeftImage: HTMLImageElement;
  topRightImage: HTMLImageElement;
  bottomLeftImage: HTMLImageElement;
  bottomRightImage: HTMLImageElement;
  videoElement: HTMLVideoElement;
  stimuli: InMemoryStimuli;
  trials: Trial[];
  onNextCompletion: (result: Result) => void;
  failed: boolean;
  videoUrl: string;
  trialNumber: number;
  failureCriterion: (result: Result, trialNumber: number) => boolean;

  constructor(
    imageContainers: HTMLElement[],
    topLeftImage: HTMLImageElement,
    topRightImage: HTMLImageElement,
    bottomLeftImage: HTMLImageElement,
    bottomRightImage: HTMLImageElement,
    videoElement: HTMLVideoElement,
    stimuli: InMemoryStimuli,
    trials: Trial[],
    failureCriterion: (result: Result, trialNumber: number) => boolean,
  ) {
    this.imageContainers = imageContainers;
    this.topLeftImage = topLeftImage;
    this.topRightImage = topRightImage;
    this.bottomLeftImage = bottomLeftImage;
    this.bottomRightImage = bottomRightImage;
    this.videoElement = videoElement;
    this.stimuli = stimuli;
    this.trials = trials;
    this.failureCriterion = failureCriterion;

    this.failed = false;
    this.trialNumber = 0;
    this.videoUrl = "";
    this.onNextCompletion = () => {};
  }

  runNext() {
    const trial = this.trials.shift();
    if (!trial) return;

    this.trialNumber += 1;

    this.videoUrl = trial.url.video;
    this.videoElement.src = this.stimuli.objectURLs[trial.url.video];
    this.videoElement.muted = trial.presentation === Presentation.VO;
    runTrial(
      new DelayedVideo(this.videoElement),
      new SimpleImages(
        this.imageContainers,
        [
          { element: this.topLeftImage, url: trial.url.image.topLeft },
          { element: this.topRightImage, url: trial.url.image.topRight },
          { element: this.bottomLeftImage, url: trial.url.image.bottomLeft },
          { element: this.bottomRightImage, url: trial.url.image.bottomRight },
        ],
        this.stimuli,
      ),
      new TrialCompletionHandler(this),
    );
  }

  setOnNextCompletion(f: (result: Result) => void) {
    this.onNextCompletion = f;
  }

  callback(selectedImageUrl: string) {
    const result = {
      selectedImageUrl,
      videoUrl: this.videoUrl,
    };
    this.failed = this.failureCriterion(result, this.trialNumber);
    this.onNextCompletion(result);
  }

  completed() {
    return this.failed || this.trials.length === 0;
  }
}

class SimpleButton implements Button {
  buttonElement: HTMLButtonElement;

  constructor(buttonElement: HTMLButtonElement) {
    this.buttonElement = buttonElement;
  }

  setOnClick(f: () => void) {
    this.buttonElement.onclick = () => f();
  }

  show() {
    showElement(this.buttonElement);
  }

  hide() {
    hideElement(this.buttonElement);
  }
}

class PerformanceTimeStamp implements TimeStamp {
  nowMilliseconds() {
    return performance.now();
  }
}

function centerElementAtPercentage(element: HTMLElement, x: number, y: number) {
  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.style.transform = `translate(${percentString(-50)}, ${percentString(
    -50,
  )})`;
}

function fixElementPosition(element: HTMLElement) {
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

function lowerRightButton(text: string) {
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

declare const jatos: any;

export function run({
  failureCriterion = () => false,
  onFinished = (results) => jatos.endStudy(results),
}: {
  failureCriterion?: (result: Result, trialNumber: number) => boolean;
  onFinished?: (results: Result[]) => void;
}) {
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

  const stimuli = new InMemoryStimuli();
  jatos.onLoad(() => {
    fetch("trials.txt")
      .then((p) => p.text())
      .then((text) => {
        const trials = parseTrials(text);
        preloadStimuli(
          stimuli,
          new UglyProgressBar(barContainingElement, barElement),
          uniqueUrls(trials),
          () =>
            runTest(
              new SimpleButton(startButtonElement),
              new StraightforwardTrials(
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
                trials,
                failureCriterion,
              ),
              new SimpleButton(continueButtonElement),
              new PerformanceTimeStamp(),
              onFinished,
            ),
        );
      });
  });
}
