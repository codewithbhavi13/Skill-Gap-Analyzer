
import { Schema, model, Types } from "mongoose";
import Skill from "./Skill.model.js";
export enum RequirementType {
  REQUIRED = "required",
  PREFERRED = "preferred",
}

export enum RequirementSourceType {
  SEEDED = "seeded",
  JOB_DESCRIPTION = "job_description",
}

export enum RequirementStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
  INACTIVE = "inactive",
}

export interface IRoleRequirement  {
  role: Types.ObjectId;
  skill: Types.ObjectId;
  requirementType: RequirementType;
  sourceType: RequirementSourceType;
  status: RequirementStatus;
  createdAt: Date;
  updatedAt: Date;
}

const roleRequirementSchema = new Schema<IRoleRequirement>(
  {
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    skill: {
  type: Schema.Types.ObjectId,
  ref: Skill.modelName,
  required: true,
},
    requirementType: {
      type: String,
      enum: Object.values(RequirementType),
      required: true,
    },

    sourceType: {
      type: String,
      enum: Object.values(RequirementSourceType),
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(RequirementStatus),
      default: RequirementStatus.PENDING,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

roleRequirementSchema.index(
  { role: 1, skill: 1 },
  { unique: true }
);

const RoleRequirement = model<IRoleRequirement>(
  "RoleRequirement",
  roleRequirementSchema
);

export default RoleRequirement;
type RoleRequirementCheck = typeof RoleRequirement;