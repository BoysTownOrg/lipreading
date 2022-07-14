import assert from "assert";
import { parseTrialUrls } from "../parse-trial-urls.js";

function assertEqualTrialUrl(actual, expected) {
  assert.equal(actual.image.topLeft, expected.image.topLeft);
  assert.equal(actual.image.topRight, expected.image.topRight);
  assert.equal(actual.image.bottomLeft, expected.image.bottomLeft);
  assert.equal(actual.image.bottomRight, expected.image.bottomRight);
  assert.equal(actual.video, expected.video);
}

function assertEqualTrialUrls(actual, expected) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assertEqualTrialUrl(actual[i], expected[i]);
}

describe("parseTrialUrls()", () => {
  it("tbd", () => {
    assertEqualTrialUrls(
      parseTrialUrls(`watch
watch wood box trash
pie
pie mouse slide boy
juice
juice shoe blue bus
pink
pink bowl hill tongue
bone
bone bug soap red
`),
      [
        {
          image: {
            topLeft: "watch.jpg",
            topRight: "wood.jpg",
            bottomLeft: "box.jpg",
            bottomRight: "trash.jpg",
          },
          video: "watch.mp4",
        },
        {
          image: {
            topLeft: "pie.jpg",
            topRight: "mouse.jpg",
            bottomLeft: "slide.jpg",
            bottomRight: "boy.jpg",
          },
          video: "pie.mp4",
        },
        {
          image: {
            topLeft: "juice.jpg",
            topRight: "shoe.jpg",
            bottomLeft: "blue.jpg",
            bottomRight: "bus.jpg",
          },
          video: "juice.mp4",
        },
        {
          image: {
            topLeft: "pink.jpg",
            topRight: "bowl.jpg",
            bottomLeft: "hill.jpg",
            bottomRight: "tongue.jpg",
          },
          video: "pink.mp4",
        },
        {
          image: {
            topLeft: "bone.jpg",
            topRight: "bug.jpg",
            bottomLeft: "soap.jpg",
            bottomRight: "red.jpg",
          },
          video: "bone.mp4",
        },
      ]
    );
  });
});
