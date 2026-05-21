export function getIsHoverDevice() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}
