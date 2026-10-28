import { Schema, model, Types } from "mongoose";

export enum EducationLevel {
  HIGH_SCHOOL = "high_school",
  DIPLOMA = "diploma",
  BACHELORS = "bachelors",
  MASTERS = "masters",
  DOCTORAL = "doctoral",
  OTHER = "other",
}

export enum ProfessionalStatus {
  STUDENT = "student",
  EMPLOYED = "employed",
  UNEMPLOYED = "unemployed",
  FREELANCER = "freelancer",
  CAREER_SWITCHER = "career_switcher",
  OTHER = "other",
}

export interface ILearnerProfile {
  user: Types.ObjectId;
  educationLevel: EducationLevel;
  professionalStatus: ProfessionalStatus;
  yearsOfExperience: number;
  targetRole: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const learnerProfileSchema = new Schema<ILearnerProfile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    educationLevel: {
      type: String,
      enum: Object.values(EducationLevel),
      required: true,
    },
    professionalStatus: {
      type: String,
      enum: Object.values(ProfessionalStatus),
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isFinite,
        message: "Years of experience must be a finite number",
      },
    },
    targetRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
  },
  { timestamps: true }
);

const LearnerProfile = model<ILearnerProfile>(
  "LearnerProfile",
  learnerProfileSchema
);

export default LearnerProfile;
