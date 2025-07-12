// export const frames = [
//   "/images/nickRoomPageAnimation/frame-1.png",
//   "/images/nickRoomPageAnimation/frame-2.png",
//   "/images/nickRoomPageAnimation/frame-3.png",
//   "/images/nickRoomPageAnimation/frame-4.png",
//   "/images/nickRoomPageAnimation/frame-5.png",
//   "/images/nickRoomPageAnimation/frame-6.png",
//   "/images/nickRoomPageAnimation/frame-7.png",
//   "/images/nickRoomPageAnimation/frame-8.png",
//   "/images/nickRoomPageAnimation/frame-9.png",
//   "/images/nickRoomPageAnimation/frame-10.png",
// ];

import { getSpriteFrames } from "@/utils";
import nickRoomAnimationSprite from "@public/data/spritesSheets/nickRoomPageAnimationSprite.json";

export const frames = getSpriteFrames([nickRoomAnimationSprite]);
