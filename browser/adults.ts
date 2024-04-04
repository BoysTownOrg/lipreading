import { run } from "./experiment"
import { trialIsCorrect } from "../evaluate"
import { Result } from "../run-test";

declare const jatos: any;

class State {
  failed: boolean

  constructor() {
    this.failed = false;
  }

  failureCriterion(result: Result, trialNumber: number): boolean {
    this.failed ||= trialNumber < 3 && !trialIsCorrect(filestem(result.videoUrl), filestem(result.selectedImageUrl))
    return this.failed;
  }

  onFinished(results: Result[]) {
    if (this.failed) {
      document.body.replaceChildren();
      const message = document.createElement("div");
      message.textContent = "You did not pass the attention check. You do not qualify for the experiment. Please return the experiment in Prolific.";
      const exitButton = document.createElement("button");
      exitButton.textContent = "Exit";
      exitButton.onclick = () => { jatos.endStudy(results) };
      document.body.append(message);
      document.body.append(exitButton);
    }
    else {
      jatos.endStudy(results)
    }
  }
}

const state = new State();

run({
  failureCriterion: (result, trialNumber) => {
    return state.failureCriterion(result, trialNumber);
  },
  onFinished: (results) => {
    return state.onFinished(results);
  }
})

// https://stackoverflow.com/a/48165000
function filestem(path: string): string {
  var filename = path.replace(/^.*[\\\/]/, '');
  return filename.substring(0, filename.lastIndexOf('.'));
}
