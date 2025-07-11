export function preloadImages(srcArray: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    if (srcArray.length === 0) {
      resolve(true);
      return;
    }

    let loadedCount = 0;
    let hasError = false;

    srcArray.forEach((src) => {
      const img = new Image();

      img.onload = () => {
        loadedCount++;
        if (loadedCount === srcArray.length) {
          resolve(!hasError);
        }
      };

      img.onerror = () => {
        loadedCount++;
        hasError = true;
        if (loadedCount === srcArray.length) {
          resolve(false);
        }
      };

      img.src = src;
    });
  });
}
