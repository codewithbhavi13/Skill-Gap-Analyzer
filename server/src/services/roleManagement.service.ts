import Role from "../models/Role.model.js";
import Skill from "../models/Skill.model.js";
import RoleRequirement, {
  RequirementStatus,
} from "../models/RoleRequirement.model.js";

export const getAllRoles = async () => {
  const roles = await Role.find({ isActive: true })
    .select("name normalizedName description")
    .sort({ name: 1 })
    .lean();

  return roles;
};

export const getSkillsByRole = async (roleName: string) => {
  const normalizedRoleName = roleName
  .trim()
  .toLowerCase()
  .replace(/\s*\/\s*/g, " ")
  .replace(/\s+/g, " ");

const role = await Role.findOne({
  normalizedName: normalizedRoleName,
  isActive: true,
}).lean();

  if (!role) {
    return null;
  }

  const requirements = await RoleRequirement.find({
    role: role._id,
    status: RequirementStatus.ACTIVE,
  })
    .populate("skill", "name normalizedName category description")
    .lean();

  return requirements;
};


export const getAllSkills = async () => {
  const skills = await Skill.find({ isActive: true })
    .select("name normalizedName aliases category description")
    .sort({ name: 1 })
    .lean();

  return skills;
};
