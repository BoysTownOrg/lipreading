import { runTrial } from "../run-trial.js";

class Video {
  constructor(videoElement) {
    this.videoElement = videoElement;
  }

  setOnFinish(f) {
    this.videoElement.onended = (event) => {
      f();
    };
  }

  play() {
    this.videoElement.play();
  }

  show() {
    this.videoElement.style.visibility = "visible";
  }

  hide() {
    this.videoElement.style.visibility = "hidden";
  }
}

class Images {
  constructor(imageElements) {
    this.imageElements = imageElements;
  }

  setOnTouch(f) {
    this.imageElements.forEach((element) => {
      element.onclick = (event) => {
        f();
      };
    });
  }

  show() {
    this.imageElements.forEach(
      (element) => (element.style.visibility = "visible")
    );
  }

  hide() {
    this.imageElements.forEach(
      (element) => (element.style.visibility = "hidden")
    );
  }
}

function centerElementAtPercentage(element, x, y) {
  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.style.transform = "translate(-50%, -50%)";
}

function quadrantImage() {
  const image = new Image();
  image.style.position = "fixed";
  image.style.maxWidth = "50%";
  image.style.maxHeight = "50%";
  image.style.visibility = "hidden";
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
videoElement.style.position = "fixed";
centerElementAtPercentage(videoElement, 50, 50);
videoElement.style.visibility = "hidden";
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
button.style.position = "fixed";
centerElementAtPercentage(button, 50, 50);
button.textContent = "start";
button.onclick = () => {
  runTrial(video, images);
};
document.body.appendChild(button);
