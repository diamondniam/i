// scripts/compress.mjs
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const inputDir = "./public/images/rennordAnimation";
const outputDir = "./public/images/rennordAnimation-compressed";

const files = await fs.readdir(inputDir);

await fs.mkdir(outputDir, { recursive: true });

for (const file of files) {
  if (!file.endsWith(".png")) continue;

  const inputPath = path.join(inputDir, file);
  const outputPath = path.join(outputDir, file);

  await sharp(inputPath).png({ compressionLevel: 9 }).toFile(outputPath);

  console.log(`✅ Compressed: ${file}`);
}

console.log("🎉 All PNGs compressed!");
