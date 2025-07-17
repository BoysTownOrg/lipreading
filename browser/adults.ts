import { trialIsCorrect } from "../evaluate";
import { parseTrials } from "../parse-trials";
import type { Result } from "../run-test";
import { run } from "./experiment";

declare const jatos: any;

class State {
  failed: boolean;

  constructor() {
    this.failed = false;
  }

  failureCriterion(result: Result, trialNumber: number): boolean {
    this.failed ||=
      trialNumber < 3 &&
      !trialIsCorrect(
        filestem(result.videoUrl),
        filestem(result.selectedImageUrl),
      );
    return this.failed;
  }

  onFinished(results: Result[]) {
    if (this.failed) {
      document.body.replaceChildren();
      const message = document.createElement("div");
      message.textContent =
        "You did not pass the attention check. You do not qualify for the experiment. Please return the experiment in Prolific.";
      const exitButton = document.createElement("button");
      exitButton.textContent = "Exit";
      exitButton.onclick = () => {
        jatos.endStudy(results);
      };
      document.body.append(message);
      document.body.append(exitButton);
    } else {
      jatos.startNextComponent(results);
    }
  }
}

const state = new State();

async function main() {
  const trials = parseTrials(await (await fetch("trials.txt")).text());

  run(trials, {
    failureCriterion: (result, trialNumber) => {
      return state.failureCriterion(result, trialNumber);
    },
    onFinished: (results) => {
      return state.onFinished(results);
    },
  });
}

main();

// https://stackoverflow.com/a/48165000
function filestem(path: string): string {
  var filename = path.replace(/^.*[\\\/]/, "");
  return filename.substring(0, filename.lastIndexOf("."));
}
