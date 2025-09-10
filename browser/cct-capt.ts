import { Presentation, type Trial } from "../parse-trials.ts";
import * as experiment from "./experiment.ts";

declare const jatos: {
  onLoad(_: () => void): void;
  endStudy(_: unknown, success: boolean): void;
  startNextComponent(data?: unknown): void;
};

const cctImageNamesByGroup = [
  ["1_cow.png", "2_owl.png", "3_house.png", "4_mouse.png"],
  ["1_bed.png", "2_hen.png", "3_peg.png", "4_egg.png"],
  ["1_fan.png", "2_man.png", "3_cat.png", "4_hat.png"],
  ["1_key.png", "2_three.png", "3_feet.png", "4_sheep.png"],
  ["1_pig.png", "2_chick.png", "3_fish.png", "4_ship.png"],
  ["1_horse.png", "2_ball.png", "3_fork.png", "4_door.png"],
  ["1_shoe.png", "2_moon.png", "3_spoon.png", "4_food.png"],
  ["1_pipe.png", "2_pie.png", "3_kite.png", "4_five.png"],
  ["1_sock.png", "2_cot.png", "3_doll.png", "4_dog.png"],
  ["1_jug.png", "2_duck.png", "3_bus.png", "4_cup.png"],
];

const captImageNamesByGroup = [
  ["1_mat.png", "2_bat.png", "3_cat.png", "4_fat.png"],
  ["1_wine.png", "2_wise.png", "3_white.png", "4_wipe.png"],
  ["1_fin.png", "2_tin.png", "3_shin.png", "4_chin.png"],
  ["1_stork.png", "2_talk.png", "3_ chalk.png", "4_fork.png"],
  ["1_bun.png", "2_bug.png", "3_bud.png", "4_buzz.png"],
  ["1_kick.png", "2_tick.png", "3_thick.png", "4_pick.png"],
  ["1_white.png", "2_right.png", "3_light.png", "4_night.png"],
  ["1_law.png", "2_raw.png", "3_war.png", "4_your.png"],
  ["1_what.png", "2_wash.png", "3_want.png", "4_watch.png"],
  ["1_jug.png", "2_drug.png", "3_bug.png", "4_mug.png"],
  ["1_cheap.png", "2_cheat.png", "3_cheek.png", "4_cheese.png"],
  ["1_caught.png", "2_call.png", "3_corn.png", "4_core.png"],
];

interface Settings {
  url: string;
  videoFilePrefix: string;
  imageNamesByGroup: string[][];
  presentation: Presentation;
}

async function fetchTrials(settings: Settings): Promise<Trial[]> {
  const raw = await (await fetch(settings.url)).text();
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter((s, i) => i > 0 && s.length > 0)
    .map((s) => s.split(",").map((s) => s.trim()))
    .map((row) => {
      if (row.length !== 5)
        throw new Error(
          `Unexpected number of columns in ${settings.url}: ${row}`,
        );
      const [groupRaw, , , , fileRaw] = row;
      const group = parseInt(groupRaw, 10);
      if (
        Number.isNaN(group) ||
        group > settings.imageNamesByGroup.length ||
        group < 1
      )
        throw new Error(`Unexpected group in ${settings.url}: ${row}`);
      const imageNames = settings.imageNamesByGroup[group - 1];
      const videoFileSuffix = fileRaw;
      return {
        url: {
          image: {
            topLeft: imageNames[0],
            topRight: imageNames[1],
            bottomLeft: imageNames[2],
            bottomRight: imageNames[3],
          },
          video: `${settings.videoFilePrefix}${videoFileSuffix}`.replace(
            /mp4$/,
            "mov",
          ),
        },
        presentation: settings.presentation,
      };
    });
}

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
  const orderSelect = document.getElementById("order");
  if (!orderSelect) throw new Error("BUG: order select element not found");
  const conditionSelect = document.getElementById("condition");
  if (!conditionSelect)
    throw new Error("BUG: condition select element not found");
  const snrSelect = document.getElementById("snr");
  if (!snrSelect) throw new Error("BUG: snr select element not found");
  const settings = await new Promise<Settings>((resolve) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const order = (orderSelect as HTMLSelectElement).value;
      if (order === "") return false;
      const stimulusSet = (stimulusSetSelect as HTMLSelectElement).value;
      let imageNamesByGroup: string[][] | null = null;
      switch (stimulusSet) {
        case "CCT":
          imageNamesByGroup = cctImageNamesByGroup;
          break;
        case "CAPT":
          imageNamesByGroup = captImageNamesByGroup;
          break;
        default:
          return false;
      }
      let presentation: Presentation | null = null;
      switch ((conditionSelect as HTMLSelectElement).value) {
        case "av":
          presentation = Presentation.AV;
          break;
        case "ao":
          presentation = Presentation.AO;
          break;
        default:
          return false;
      }
      let noisePrefix: string | null = null;
      switch ((snrSelect as HTMLSelectElement).value) {
          case "noise":
              noisePrefix = "noise-";
              break;
          case "quiet":
              noisePrefix = "";
              break;
          default:
              return false;
      }
      resolve({
        url: `${stimulusSet}_order${order}.csv`,
        videoFilePrefix: `${stimulusSet}-${noisePrefix}`,
        imageNamesByGroup,
        presentation,
      });
    });
  });
  form.remove();
  const trials = await fetchTrials(settings);
  experiment.run(trials, {});
}

main();
