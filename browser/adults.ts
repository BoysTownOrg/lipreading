import { run } from "./experiment"
import { trialIsCorrect } from "../evaluate"
import { Result } from "../run-test";

import { initJsPsych } from 'jspsych';
import survey from '@jspsych/plugin-survey';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';

import 'jspsych/css/jspsych.css'
import '@jspsych/plugin-survey/css/survey.css'

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
      document.body.replaceChildren();
      const jsPsych = initJsPsych({
        on_finish: () => jatos.endStudy(results)
      });
      jsPsych.run([
        {
          type: htmlButtonResponse,
          choices: ['Continue'],
          stimulus: "We will ask you a few questions. Please provide answers to each or select \"prefer not to answer.\""
        },
        {
          type: survey,
          pages: [
            [
              {
                type: 'multi-choice',
                prompt: "What is your age in years?",
                options: [...Array.from(new Array(11), (_x, i) => i + 19).map((x) => x.toString()), "older", "prefer not to answer"],
                required: true
              },
            ],
            [
              {
                type: 'multi-choice',
                prompt: "What is your gender?",
                options: ["male", "female", "other", "prefer not to answer"],
                required: true
              },
            ],
            [
              {
                type: 'multi-choice',
                prompt: "Your answers to these question help us to ensure that our data represent the population at large. What is your ethnicity?",
                options: [
                  "Hispanic or Latino",
                  "not Hispanic or Latino",
                  "prefer not to answer"],
                required: true
              },
              {
                type: "multi-select",
                prompt: "What is your race?",
                options: [
                  "American Indian or Alaska Native",
                  "Asian",
                  "Black or African American",
                  "Native Hawaiian or Other Pacific Islander",
                  "Caucasian",
                  "prefer not to answer"]
              }
            ],
            [
              {
                type: "likert",
                prompt: "Please rate the quality of the video playback in the experiment from 1 to 5, where 5 is excellent and 1 is poor.",
                likert_scale_min_label: "poor",
                likert_scale_max_label: "excellent",
                required: true
              }
            ],
            [
              {
                type: "multi-choice",
                prompt: "Were there any problems with the experiment? Your answer will not affect your payment.",
                options: ["Yes", "No"],
                required: true
              },
              {
                type: "text",
                prompt: "If yes, please describe the problem below. Your answer will not affect your payment."
              }
            ],
            [
              {
                type: "multi-choice",
                prompt: "Did you randomly guess? Or do the task to the best of your ability? Your answer will not affect your payment.",
                options: ["randomly guessed", "tried my best"],
                required: true
              }
            ]
          ],
        }]);
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
