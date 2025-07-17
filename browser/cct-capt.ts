import * as experiment from "./experiment.ts";

declare const jatos: any;

async function main() {
  try {
    await run();
  } catch (e) {
    jatos.onLoad(() => {
      jatos.endStudy(`${e}`, false);
    });
  }
}

async function run() {
  const form = document.getElementById("tasksettings");
  if (!form) throw new Error("BUG: form element not found");
  const stimulusSetSelect = document.getElementById("stimulusset");
  if (!stimulusSetSelect)
    throw new Error("BUG: stimulus set select element not found");
  const conditionSelect = document.getElementById("condition");
  if (!conditionSelect)
    throw new Error("BUG: condition select element not found");
  const settings = await new Promise((resolve) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      switch ((stimulusSetSelect as HTMLSelectElement).value) {
        case "cct":
          break;
        case "capt":
          break;
        default:
          return false;
      }
      switch ((conditionSelect as HTMLSelectElement).value) {
        case "av":
          break;
        case "ao":
          break;
        default:
          return false;
      }
      // const taskDurationSeconds = Number.parseInt(taskDurationInput.value, 10);
      // if (Number.isNaN(taskDurationSeconds) || taskDurationSeconds < 0)
      //   return false;
      // resolve({
      //   participantID: participantIDInput.value,
      //   taskDurationSeconds,
      //   serialPort,
      //   familiarization: familiarizationCheckbox?.checked ?? false,
      // });
    });
  });
  form.remove();
  const trials = [];
  experiment.run(trials, {});
}

main();
