import assert from "assert";
import { parseTrials } from "../parse-trials.js";

function assertEqualTrial(actual, expected) {
  assert.equal(actual.url.image.topLeft, expected.url.image.topLeft);
  assert.equal(actual.url.image.topRight, expected.url.image.topRight);
  assert.equal(actual.url.image.bottomLeft, expected.url.image.bottomLeft);
  assert.equal(actual.url.image.bottomRight, expected.url.image.bottomRight);
  assert.equal(actual.url.video, expected.url.video);
  assert.equal(actual.muted, expected.muted);
}

function assertEqualTrials(actual, expected) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assertEqualTrial(actual[i], expected[i]);
}

describe("parseTrials()", () => {
  it("tbd", () => {
    assertEqualTrials(
      parseTrials(`watch av
watch wood box trash
pie av
pie mouse slide boy
juice vo
juice shoe blue bus
pink vo
pink bowl hill tongue
bone vo
bone bug soap red
`),
      [
        {
          url: {
            image: {
              topLeft: "watch.jpg",
              topRight: "wood.jpg",
              bottomLeft: "box.jpg",
              bottomRight: "trash.jpg",
            },
            video: "watch.mp4",
          },
          muted: false,
        },
        {
          url: {
            image: {
              topLeft: "pie.jpg",
              topRight: "mouse.jpg",
              bottomLeft: "slide.jpg",
              bottomRight: "boy.jpg",
            },
            video: "pie.mp4",
          },
          muted: false,
        },
        {
          url: {
            image: {
              topLeft: "juice.jpg",
              topRight: "shoe.jpg",
              bottomLeft: "blue.jpg",
              bottomRight: "bus.jpg",
            },
            video: "juice.mp4",
          },
          muted: true,
        },
        {
          url: {
            image: {
              topLeft: "pink.jpg",
              topRight: "bowl.jpg",
              bottomLeft: "hill.jpg",
              bottomRight: "tongue.jpg",
            },
            video: "pink.mp4",
          },
          muted: true,
        },
        {
          url: {
            image: {
              topLeft: "bone.jpg",
              topRight: "bug.jpg",
              bottomLeft: "soap.jpg",
              bottomRight: "red.jpg",
            },
            video: "bone.mp4",
          },
          muted: true,
        },
      ]
    );
  });
});
