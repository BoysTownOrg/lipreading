export function trialIsCorrect(videoName, chosenImageName) {
  const [stem,] = videoName.split('.')
  const [chosen,] = chosenImageName.split('_')
  return stem === chosen
}
