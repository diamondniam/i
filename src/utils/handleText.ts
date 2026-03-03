export function getBreakedText(text: string) {
  return text
    .split("\n")
    .map((line, index) => {
      return `<span key={${index}}>${line}<br /></span>`;
    })
    .join("");
}
