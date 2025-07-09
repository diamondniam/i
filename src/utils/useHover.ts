export function useIsHoverDevice() {
  return window.matchMedia("(hover: hover)").matches;
}
