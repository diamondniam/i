export function preloadImages(
  srcArray: string[]
): Promise<{ isLoaded: boolean; images: Map<string, HTMLImageElement> }> {
  const images = new Map<string, HTMLImageElement>();

  return new Promise((resolve) => {
    if (srcArray.length === 0) {
      resolve({ isLoaded: true, images });
      return;
    }

    let loadedCount = 0;
    let hasError = false;

    srcArray.forEach((src) => {
      images.set(src, new Image());
      const img = images.get(src)!;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === srcArray.length) {
          resolve({ isLoaded: !hasError, images });
        }
      };

      img.onerror = () => {
        loadedCount++;
        hasError = true;
        if (loadedCount === srcArray.length) {
          resolve({ isLoaded: !hasError, images });
        }
      };

      img.src = src;
    });
  });
}
