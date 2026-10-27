
import "dotenv/config";
import mongoose from "mongoose";

import connectDatabase from "../config/database.js";
import Role from "../models/Role.model.js";
import Skill, { SkillCategory } from "../models/Skill.model.js";
import RoleRequirement, {
  RequirementType,
  RequirementSourceType,
  RequirementStatus,
} from "../models/RoleRequirement.model.js";

// 1. Define our eight target roles
const roles = [
  {
    name: "Frontend Developer",
    normalizedName: "frontend developer",
    description: "Develops user interfaces and client-side web applications.",
  },
  {
    name: "Backend Developer",
    normalizedName: "backend developer",
    description: "Develops server-side applications, APIs, and data services.",
  },
  {
    name: "Full-Stack Developer",
    normalizedName: "full-stack developer",
    description: "Develops both frontend and backend applications.",
  },
  {
    name: "Software Tester / QA Engineer",
    normalizedName: "software tester qa engineer",
    description: "Tests software quality, reliability, and functionality.",
  },
  {
    name: "DevOps Engineer",
    normalizedName: "devops engineer",
    description: "Automates software delivery and deployment workflows.",
  },
  {
    name: "Cloud Engineer",
    normalizedName: "cloud engineer",
    description: "Builds and manages cloud infrastructure and services.",
  },
  {
    name: "AI/ML Engineer",
    normalizedName: "ai ml engineer",
    description: "Develops and evaluates artificial intelligence and machine learning systems.",
  },
  {
    name: "Cybersecurity Engineer",
    normalizedName: "cybersecurity engineer",
    description: "Protects applications, systems, and networks from security threats.",
  },
];

// 2. Define the initial skill catalog
const skills = [
  {
    name: "HTML",
    normalizedName: "html",
    aliases: [],
    category: SkillCategory.FRONTEND,
  },
  {
    name: "CSS",
    normalizedName: "css",
    aliases: [],
    category: SkillCategory.FRONTEND,
  },
  {
    name: "JavaScript",
    normalizedName: "javascript",
    aliases: ["JS"],
    category: SkillCategory.FULL_STACK,
  },
  {
    name: "TypeScript",
    normalizedName: "typescript",
    aliases: ["TS"],
    category: SkillCategory.FULL_STACK,
  },
  {
    name: "React",
    normalizedName: "react",
    aliases: ["ReactJS", "React.js"],
    category: SkillCategory.FRONTEND,
  },
  {
    name: "Next.js",
    normalizedName: "next.js",
    aliases: ["NextJS"],
    category: SkillCategory.FRONTEND,
  },
  {
    name: "Node.js",
    normalizedName: "node.js",
    aliases: ["NodeJS", "Node"],
    category: SkillCategory.BACKEND,
  },
  {
    name: "Express.js",
    normalizedName: "express.js",
    aliases: ["Express", "ExpressJS"],
    category: SkillCategory.BACKEND,
  },
  {
    name: "Python",
    normalizedName: "python",
    aliases: [],
    category: SkillCategory.BACKEND,
  },
  {
    name: "REST API Development",
    normalizedName: "rest api development",
    aliases: ["REST APIs"],
    category: SkillCategory.BACKEND,
  },
  {
    name: "SQL",
    normalizedName: "sql",
    aliases: [],
    category: SkillCategory.BACKEND,
  },
  {
    name: "MongoDB",
    normalizedName: "mongodb",
    aliases: [],
    category: SkillCategory.BACKEND,
  },
  {
    name: "Git",
    normalizedName: "git",
    aliases: ["Git version control"],
    category: SkillCategory.DEVOPS,
  },
  {
    name: "Software Testing",
    normalizedName: "software testing",
    aliases: ["Testing", "QA Testing"],
    category: SkillCategory.TESTING,
  },
  {
    name: "Jest",
    normalizedName: "jest",
    aliases: [],
    category: SkillCategory.TESTING,
  },
  {
    name: "Playwright",
    normalizedName: "playwright",
    aliases: [],
    category: SkillCategory.TESTING,
  },
  {
    name: "Docker",
    normalizedName: "docker",
    aliases: [],
    category: SkillCategory.DEVOPS,
  },
  {
    name: "CI/CD",
    normalizedName: "ci/cd",
    aliases: ["Continuous Integration", "Continuous Delivery"],
    category: SkillCategory.DEVOPS,
  },
  {
    name: "Linux",
    normalizedName: "linux",
    aliases: [],
    category: SkillCategory.DEVOPS,
  },
  {
    name: "Kubernetes",
    normalizedName: "kubernetes",
    aliases: ["K8s"],
    category: SkillCategory.CLOUD,
  },
  {
    name: "AWS",
    normalizedName: "aws",
    aliases: ["Amazon Web Services"],
    category: SkillCategory.CLOUD,
  },
  {
    name: "Microsoft Azure",
    normalizedName: "microsoft azure",
    aliases: ["Azure"],
    category: SkillCategory.CLOUD,
  },
  {
    name: "Machine Learning",
    normalizedName: "machine learning",
    aliases: ["ML"],
    category: SkillCategory.AI_ML,
  },
  {
    name: "Data Analysis",
    normalizedName: "data analysis",
    aliases: [],
    category: SkillCategory.AI_ML,
  },
  {
    name: "Scikit-learn",
    normalizedName: "scikit-learn",
    aliases: ["sklearn"],
    category: SkillCategory.AI_ML,
  },
  {
    name: "TensorFlow",
    normalizedName: "tensorflow",
    aliases: [],
    category: SkillCategory.AI_ML,
  },
  {
    name: "Computer Networking",
    normalizedName: "computer networking",
    aliases: ["Networking"],
    category: SkillCategory.CYBERSECURITY,
  },
  {
    name: "OWASP Security",
    normalizedName: "owasp security",
    aliases: ["OWASP"],
    category: SkillCategory.CYBERSECURITY,
  },
  {
    name: "Vulnerability Assessment",
    normalizedName: "vulnerability assessment",
    aliases: [],
    category: SkillCategory.CYBERSECURITY,
  },
  {
    name: "Identity and Access Management",
    normalizedName: "identity and access management",
    aliases: ["IAM"],
    category: SkillCategory.CYBERSECURITY,
  },
];

// 3. Define initial baseline skills for each role
// These are starting assumptions to validate through research.
const roleSkillMap: Record<string, string[]> = {
  "frontend developer": [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "next.js",
    "git",
    "software testing",
  ],
  "backend developer": [
    "javascript",
    "typescript",
    "node.js",
    "express.js",
    "python",
    "rest api development",
    "sql",
    "mongodb",
    "git",
    "software testing",
  ],
  "full-stack developer": [
    "html",
    "css",
    "javascript",
    "typescript",
    "react",
    "node.js",
    "express.js",
    "rest api development",
    "sql",
    "mongodb",
    "git",
    "software testing",
  ],
  "software tester qa engineer": [
    "software testing",
    "jest",
    "playwright",
    "javascript",
    "python",
    "sql",
    "git",
  ],
  "devops engineer": [
    "linux",
    "git",
    "docker",
    "ci/cd",
    "kubernetes",
    "aws",
    "microsoft azure",
    "software testing",
  ],
  "cloud engineer": [
  "linux",
  "computer networking",
  "docker",
  "kubernetes",
  "aws",
  "microsoft azure",
  "identity and access management",
  "git",
],
  "ai ml engineer": [
    "python",
    "data analysis",
    "machine learning",
    "scikit-learn",
    "tensorflow",
    "sql",
    "git",
  ],
  "cybersecurity engineer": [
    "computer networking",
    "linux",
    "owasp security",
    "vulnerability assessment",
    "identity and access management",
    "python",
    "git",
  ],
};

const seedRoleManagement = async (): Promise<void> => {
  await connectDatabase();

  // 4. Create or find all roles
  const savedRoles = new Map<string, mongoose.Types.ObjectId>();

  for (const roleData of roles) {
    const role = await Role.findOneAndUpdate(
      { normalizedName: roleData.normalizedName },
      {
        $setOnInsert: {
          ...roleData,
          isActive: true,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    savedRoles.set(roleData.normalizedName, role._id);
  }

  // 5. Create or find all skills
  const savedSkills = new Map<string, mongoose.Types.ObjectId>();

  for (const skillData of skills) {
    const skill = await Skill.findOneAndUpdate(
      { normalizedName: skillData.normalizedName },
      {
        $setOnInsert: {
          ...skillData,
          description: "",
          isActive: true,
        },
      },
      { upsert: true, returnDocument: "after" }
    );

    savedSkills.set(skillData.normalizedName, skill._id);
  }

  // 6. Link each role to its baseline skills
  for (const [roleName, skillNames] of Object.entries(roleSkillMap)) {
    const roleId = savedRoles.get(roleName);

    if (!roleId) {
      throw new Error(`Role not found in seed data: ${roleName}`);
    }

    for (const skillName of skillNames) {
      const skillId = savedSkills.get(skillName);

      if (!skillId) {
        throw new Error(`Skill not found in seed data: ${skillName}`);
      }

      await RoleRequirement.updateOne(
        { role: roleId, skill: skillId },
        {
          $setOnInsert: {
            role: roleId,
            skill: skillId,
            requirementType: RequirementType.REQUIRED,
            sourceType: RequirementSourceType.SEEDED,
            status: RequirementStatus.ACTIVE,
          },
        },
        { upsert: true }
      );
    }
  }

  console.log("Role management seed completed successfully.");
  console.log(`Roles processed: ${savedRoles.size}`);
  console.log(`Skills processed: ${savedSkills.size}`);
  console.log(
    `Role-skill mappings processed: ${Object.values(roleSkillMap).reduce(
      (total, items) => total + items.length,
      0
    )}`
  );
};

seedRoleManagement()
  .catch((error: unknown) => {
    console.error("Role management seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
