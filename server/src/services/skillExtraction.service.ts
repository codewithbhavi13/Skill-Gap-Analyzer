
import Skill from "../models/Skill.model.js";

export const getActiveSkills = async () => {
  const skills = await Skill.find({ isActive: true })
    .select("name normalizedName aliases category")
    .sort({ name: 1 })
    .lean();

  return skills;
};



export const matchSkillsInText = (
  description: string,
  skills: Awaited<ReturnType<typeof getActiveSkills>>
) => {
  const normalizedText = description.toLowerCase();

  const matchedSkills = skills.filter((skill) => {
    const terms = [skill.name, ...skill.aliases];

    return terms.some((term) => {
      const escapedTerm = term.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      if (!escapedTerm) {
        return false;
      }

      // Treat letters and numbers as word characters.
      // Keep symbols such as # and + inside technical skill names.
   const pattern = new RegExp(
  `(^|[^a-z0-9])${escapedTerm}(?![a-z0-9]|\\s+native\\b)`,
  "i"
);

      return pattern.test(normalizedText);
    });
  });

  return matchedSkills;
};

