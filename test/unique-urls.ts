import assert from "assert";
import { uniqueUrls } from "../unique-urls.ts";

function assertEqualArrays(actual: string[], expected: string[]) {
  assert.equal(actual.length, expected.length);
  for (let i = 0; i < expected.length; i += 1)
    assert.equal(actual[i], expected[i]);
}

describe("parseTrialUrls()", () => {
  it("tbd", () => {
    assertEqualArrays(
      uniqueUrls([
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
        },
        {
          url: {
            image: {
              topLeft: "pie.jpg",
              topRight: "mouse.jpg",
              bottomLeft: "slide.jpg",
              bottomRight: "trash.jpg",
            },
            video: "juice.mp4",
          },
        },
        {
          url: {
            image: {
              topLeft: "wood.jpg",
              topRight: "shoe.jpg",
              bottomLeft: "blue.jpg",
              bottomRight: "bus.jpg",
            },
            video: "juice.mp4",
          },
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
