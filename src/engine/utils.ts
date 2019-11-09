/* eslint-disable import/prefer-default-export */
/**
 * Pick a random index of an array according to weights.
 * @param weights An array of weights. By default they should sum up to 1.
 * @param normalize If to normalize array.
 * @returns A number [0, ..., weights.length -1].
 */
export function weightedRandomInt(weights: number[], normalize = true): number {
  let r = Math.random();
  if (normalize) {
    r *= weights.reduce((a, b) => a + b, 0);
  }
  let cumSum = 0;
  for (let i = 0; i < weights.length; i += 1) {
    cumSum += weights[i];
    if (cumSum > r) {
      return i;
    }
  }
  return -1;
}
