import * as experiment from "./experiment.ts";

declare const jatos: any;

/*
CCT-ball.mov
CCT-bed.mov
CCT-bus.mov
CCT-cat.mov
CCT-chick.mov
CCT-cot.mov
CCT-cow.mov
CCT-cup.mov
CCT-dog.mov
CCT-doll.mov
CCT-door.mov
CCT-duck.mov
CCT-egg.mov
CCT-fan.mov
CCT-feet.mov
CCT-fish.mov
CCT-five.mov
CCT-food.mov
CCT-fork.mov
CCT-hat.mov
CCT-hen.mov
CCT-horse.mov
CCT-house.mov
CCT-jug.mov
CCT-key.mov
CCT-kite.mov
CCT-man.mov
CCT-moon.mov
CCT-mouse.mov
CCT-owl.mov
CCT-peg.mov
CCT-pie.mov
CCT-pig.mov
CCT-pipe.mov
CCT-sheep.mov
CCT-ship.mov
CCT-shoe.mov
CCT-sock.mov
CCT-spoon.mov
CCT-three.mov

+---Table 1
1_cow.png,2_owl.png,3_house.png,4_mouse.png
1_bed.png,2_hen.png,3_peg.png,4_egg.png
1_fan.png,2_man.png,3_cat.png,4_hat.png
1_key.png,2_three.png,3_feet.png,4_sheep.png
1_pig.png,2_chick.png,3_fish.png,4_ship.png
1_horse.png,2_ball.png,3_fork.png,4_door.png
1_shoe.png,2_moon.png,3_spoon.png,4_food.png
1_pipe.png,2_pie.png,3_kite.png,4_five.png
1_sock.png,2_cot.png,3_doll.png,4_dog.png
1_jug.png,2_duck.png,3_bus.png,4_cup.png

CAPT-bat.mov
CAPT-bud.mov
CAPT-bug.mov
CAPT-bun.mov
CAPT-buzz.mov
CAPT-call.mov
CAPT-cat.mov
CAPT-caught.mov
CAPT-chalk.mov
CAPT-cheap.mov
CAPT-cheat.mov
CAPT-cheek.mov
CAPT-cheese.mov
CAPT-chin.mov
CAPT-core.mov
CAPT-corn.mov
CAPT-drug.mov
CAPT-fat.mov
CAPT-fin.mov
CAPT-fork.mov
CAPT-jug.mov
CAPT-kick.mov
CAPT-law.mov
CAPT-light.mov
CAPT-mat.mov
CAPT-mug.mov
CAPT-night.mov
CAPT-pick.mov
CAPT-raw.mov
CAPT-right.mov
CAPT-shin.mov
CAPT-stork.mov
CAPT-talk.mov
CAPT-thick.mov
CAPT-tick.mov
CAPT-tin.mov
CAPT-want.mov
CAPT-war.mov
CAPT-wash.mov
CAPT-watch.mov
CAPT-what.mov
CAPT-white.mov
CAPT-wine.mov
CAPT-wipe.mov
CAPT-wise.mov
CAPT-your.mov

+---Table 2
1_mat.png,2_bat.png,3_cat.png,4_fat.png
1_wine.png,2_wise.png,3_white.png,4_wipe.png
1_fin.png,2_tin.png,3_shin.png,4_chin.png
1_stork.png,2_talk.png,3_ chalk.png,4_fork.png
1_bun.png,2_bug.png,3_bud.png,4_buzz.png
1_kick.png,2_tick.png,3_thick.png,4_pick.png
1_white.png,2_right.png,3_light.png,4_night.png
1_law.png,2_raw.png,3_war.png,4_your.png
1_what.png,2_wash.png,3_want.png,4_watch.png
1_jug.png,2_drug.png,3_bug.png,4_mug.png
1_cheap.png,2_cheat.png,3_cheek.png,4_cheese.png
1_caught.png,2_call.png,3_corn.png,4_core.png
*/

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
