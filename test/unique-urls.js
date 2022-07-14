function uniqueUrls(trialUrls) {
  const unique = new Set();
  trialUrls.forEach((urls) => {
    unique.add(urls.image.topLeft);
    unique.add(urls.image.topRight);
    unique.add(urls.image.bottomLeft);
    unique.add(urls.image.bottomRight);
    unique.add(urls.video);
  });
  return [...unique].sort();
}

import assert from "assert";

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
