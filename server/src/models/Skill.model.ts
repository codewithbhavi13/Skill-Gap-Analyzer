
import { Schema, model, type Document } from "mongoose";


export enum SkillCategory {
  FRONTEND = "frontend",
  BACKEND = "backend",
  FULL_STACK = "full_stack",
  TESTING = "testing",
  DEVOPS = "devops",
  CLOUD = "cloud",
  AI_ML = "ai_ml",
  CYBERSECURITY = "cybersecurity",
}


export interface ISkill extends Document {
  name: string;
  normalizedName: string;
  aliases: string[];
  category: SkillCategory;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    normalizedName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    aliases: {
      type: [String],
      default: [],
    },

    category: {
      type: String,
      enum: Object.values(SkillCategory),
      required: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Skill = model<ISkill>("Skill", skillSchema);

export default Skill;
