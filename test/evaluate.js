import assert from "assert";
import * as evaluate from "../evaluate.js"

describe("evaluate trial", () => {
  it("tbd", () => {
    assert.equal(true, evaluate.trialIsCorrect("watch.mp4", "watch_target.PNG"))
    assert.equal(false, evaluate.trialIsCorrect("watch.mp4", "pie_target.PNG"))
  });
});
