export function trialIsCorrect(videoName: string, chosenImageName: string): boolean {
  const [stem,] = videoName.split('.')
  const [chosen,] = chosenImageName.split('_')
  return stem === chosen
}
