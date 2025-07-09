export function getRandom(min: number, max: number, isFloat = false) {
  if (isFloat) {
    return Math.random() * (max - min) + min;
  } else {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
