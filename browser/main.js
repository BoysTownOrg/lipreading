import { runTrial } from "../run-trial.js";

function hideElement(element) {
  element.style.visibility = "hidden";
}

function showElement(element) {
  element.style.visibility = "visible";
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

document.body.appendChild(topLeftImage);
document.body.appendChild(topRightImage);
document.body.appendChild(bottomLeftImage);
document.body.appendChild(bottomRightImage);
document.body.appendChild(videoElement);

const video = new Video(videoElement);
const images = new Images([
  topLeftImage,
  topRightImage,
  bottomLeftImage,
  bottomRightImage,
]);

const button = document.createElement("button");
fixElementPosition(button);
centerElementAtPercentage(button, 50, 50);
button.textContent = "start";
button.onclick = () => {
  runTrial(video, images);
};
document.body.appendChild(button);
