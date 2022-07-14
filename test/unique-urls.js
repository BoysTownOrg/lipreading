import assert from "assert";
import { uniqueUrls } from "../unique-urls.js";

function assertEqualArrays(actual, expected) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assert.equal(actual[i], expected[i]);
}

describe("parseTrialUrls()", () => {
  it("tbd", () => {
    assertEqualArrays(
      uniqueUrls([
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
            bottomRight: "trash.jpg",
          },
          video: "juice.mp4",
        },
        {
          image: {
            topLeft: "wood.jpg",
            topRight: "shoe.jpg",
            bottomLeft: "blue.jpg",
            bottomRight: "bus.jpg",
          },
          video: "juice.mp4",
        },
      ]),
      [
        "blue.jpg",
        "box.jpg",
        "bus.jpg",
        "juice.mp4",
        "mouse.jpg",
        "pie.jpg",
        "shoe.jpg",
        "slide.jpg",
        "trash.jpg",
        "watch.jpg",
        "watch.mp4",
        "wood.jpg",
      ]
    );
  });
});
