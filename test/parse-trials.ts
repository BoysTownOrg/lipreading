import assert from "assert";
import { Presentation, parseTrials, type Trial } from "../parse-trials";

function assertEqualTrial(actual: Trial, expected: Trial) {
  assert.equal(actual.url.image.topLeft, expected.url.image.topLeft);
  assert.equal(actual.url.image.topRight, expected.url.image.topRight);
  assert.equal(actual.url.image.bottomLeft, expected.url.image.bottomLeft);
  assert.equal(actual.url.image.bottomRight, expected.url.image.bottomRight);
  assert.equal(actual.url.video, expected.url.video);
  assert.equal(actual.presentation, expected.presentation);
}

function assertEqualTrials(actual: Trial[], expected: Trial[]) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assertEqualTrial(actual[i], expected[i]);
}

describe("parseTrials()", () => {
  it("tbd", () => {
    assertEqualTrials(
      parseTrials(`watch.mp4 av
watch.jpg wood.jpg box.jpg trash.jpg
pie.mp4 av
pie.jpg mouse.jpg slide.jpg boy.jpg
juice.mp4 vo
juice.jpg shoe.jpg blue.jpg bus.jpg
pink.mp4 vo
pink.jpg bowl.jpg hill.jpg tongue.jpg
bone.mp4 vo
bone.jpg bug.jpg soap.jpg red.jpg
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
          presentation: Presentation.AV,
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
          presentation: Presentation.AV,
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
          presentation: Presentation.VO,
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
          presentation: Presentation.VO,
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
          presentation: Presentation.VO,
        },
      ],
    );
  });
});
