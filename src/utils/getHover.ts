export function getIsHoverDevice() {
  return window.matchMedia("(hover: hover)").matches;
}
