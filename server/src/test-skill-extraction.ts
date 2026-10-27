
import "dotenv/config";
import mongoose from "mongoose";
import connectDatabase from "./config/database.js";
import {
  getActiveSkills,
  matchSkillsInText,
} from "./services/skillExtraction.service.js";

const runTest = async () => {
  try {
    // Connect to MongoDB first
    await connectDatabase();

 
const sampleDescription = `
  We need a Full-Stack Developer with experience in
  React, Node.js, Express.js, MongoDB, TypeScript,
  JavaScript, and Git.
`;

    const skills = await getActiveSkills();
    const matchedSkills = matchSkillsInText(
      sampleDescription,
      skills
    );

    console.log("Total active skills:", skills.length);
    console.log(
      "Matched skills:",
      matchedSkills.map((skill) => skill.name)
    );
  } catch (error) {
    console.error("Skill extraction test failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

await runTest();
