import { parseTrials } from "../parse-trials";
import { run } from "./experiment";

async function main() {
  const trials = parseTrials(await (await fetch("trials.txt")).text());
  run(trials, {});
}

main();
