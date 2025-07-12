import { preloadImages } from "@/utils/useImage";

type SpriteSheet = {
  frames: Record<string, any>;
  meta: any;
};

type SpriteSheetFrame = {
  image: HTMLImageElement | null;
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
};

export function getSpriteFrames(data: SpriteSheet[]): SpriteSheetFrame[] {
  let frames: SpriteSheetFrame[] = [];

  data.forEach((sheet) => {
    const sheetFrames = sheet.frames;
    const framesKeys = Object.keys(sheetFrames);
    const url = sheet.meta.image;

    framesKeys.forEach((key) => {
      const frameData = sheetFrames[key].frame;
      frames.push({
        image: null,
        x: frameData.x,
        y: frameData.y,
        w: frameData.w,
        h: frameData.h,
        url,
      });
    });
  });

  return frames;
}

export async function loadSpriteFrames(frames: SpriteSheetFrame[]) {
  let urls = new Map<string, string>();

  frames.forEach((frame) => {
    urls.set(frame.url, frame.url);
  });

  const { isLoaded, images } = await preloadImages([...urls.values()]);

  if (isLoaded) {
    frames.forEach((frame) => {
      const image = images.get(frame.url);
      if (image) {
        frame.image = image;
      } else {
        throw new Error("Image not found");
      }
    });
  } else {
    throw new Error("Image not loaded");
  }
}
