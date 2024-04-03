import { run } from "./experiment"
import { trialIsCorrect } from "../evaluate"

run((result, trialNumber) => {
  return trialNumber < 3 && !trialIsCorrect(filestem(result.videoUrl), filestem(result.selectedImageUrl))
})

// https://stackoverflow.com/a/48165000
function filestem(path: string): string {
  var filename = path.replace(/^.*[\\\/]/, '');
  return filename.substring(0, filename.lastIndexOf('.'));
}
