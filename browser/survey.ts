import { initJsPsych } from "jspsych";
import survey from "@jspsych/plugin-survey";
import htmlButtonResponse from "@jspsych/plugin-html-button-response";

import "jspsych/css/jspsych.css";
import "@jspsych/plugin-survey/css/survey.css";

declare const jatos: {
  componentJsonInput: {
    redirectLink?: string;
  };

  endStudyAndRedirect: any;
  endStudy: any;
  onLoad: any;
};

const jsPsych = initJsPsych({
  on_finish: () => {
    const data = jsPsych.data.get().json();
    const redirect = jatos.componentJsonInput.redirectLink;
    if (redirect && redirect.length > 0) {
      jatos.endStudyAndRedirect(redirect, data);
    } else {
      jatos.endStudy(data);
    }
  },
});
jatos.onLoad(() => {
  jsPsych.run([
    {
      type: htmlButtonResponse,
      choices: ["Continue"],
      stimulus:
        'We will ask you a few questions. Please provide answers to each or select "prefer not to answer."',
    },
    {
      type: survey,
      pages: [
        [
          {
            type: "multi-choice",
            prompt: "What is your age in years?",
            options: [
              ...Array.from(new Array(11), (_x, i) => i + 19).map((x) =>
                x.toString(),
              ),
              "older",
              "prefer not to answer",
            ],
            required: true,
          },
        ],
        [
          {
            type: "multi-choice",
            prompt: "What is your gender?",
            options: ["male", "female", "other", "prefer not to answer"],
            required: true,
          },
        ],
        [
          {
            type: "multi-choice",
            prompt:
              "Your answers to these question help us to ensure that our data represent the population at large. What is your ethnicity?",
            options: [
              "Hispanic or Latino",
              "not Hispanic or Latino",
              "prefer not to answer",
            ],
            required: true,
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
              "prefer not to answer",
            ],
          },
        ],
        [
          {
            type: "likert",
            prompt:
              "Please rate the quality of the video playback in the experiment from 1 to 5, where 5 is excellent and 1 is poor.",
            likert_scale_min_label: "poor",
            likert_scale_max_label: "excellent",
            required: true,
          },
        ],
        [
          {
            type: "multi-choice",
            prompt:
              "Were there any problems with the experiment? Your answer will not affect your payment.",
            options: ["Yes", "No"],
            required: true,
          },
          {
            type: "text",
            prompt:
              "If yes, please describe the problem below. Your answer will not affect your payment.",
          },
        ],
        [
          {
            type: "multi-choice",
            prompt:
              "Did you randomly guess? Or do the task to the best of your ability? Your answer will not affect your payment.",
            options: ["randomly guessed", "tried my best"],
            required: true,
          },
        ],
      ],
    },
    {
      type: htmlButtonResponse,
      choices: ["Next"],
      stimulus:
        "Thank you for taking part in this study. Please click the 'Next' button below to submit your responses and be redirected back to Prolific.",
    },
  ]);
});
