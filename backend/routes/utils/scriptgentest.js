import { generateLectureScript } from "./scriptgen.js";

async function testStep5() {
  const transcript = "Today we talked about Newton's laws of motion and how they apply to everyday life.";
  const textbookRefs = ["Chapter 3: Forces", "Chapter 4: Motion equations"];

  try {
    console.log("Generating lecture continuation...");
    const script = await generateLectureScript(transcript, textbookRefs);
    console.log("\n--- Generated Lecture Script ---\n");
    console.log(script);
  } catch (err) {
    console.error("Step 5 test failed:", err);
  }
}

testStep5();