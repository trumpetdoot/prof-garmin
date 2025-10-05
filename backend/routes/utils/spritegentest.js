import { generateAISprite } from "./spritegen.js";
import fs from "fs";

(async () => {
  try {
    const inputImage = "input_frame.png";
    const prompt = "Cartoon-style sprite of the character";

    console.log("⏳ Generating sprite...");
    const result = await generateAISprite(inputImage, prompt);

    console.log("🎉 Python script finished. Output:");
    console.log(result);

    // If your Python script saves the image as 'sprite.png', just check it exists
    const outputImage = "sprite.png";
    if (fs.existsSync(outputImage)) {
      console.log(`✅ Sprite image saved successfully: ${outputImage}`);
    } else {
      console.log("❌ Sprite image not found. Did Python generate it?");
    }
  } catch (err) {
    console.error("❌ Error generating sprite:", err);
  }
})();
