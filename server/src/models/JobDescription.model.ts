
import { Schema, model, type Document, Types } from "mongoose";

export enum JobDescriptionInputType {
  TEXT = "text",
  PDF = "pdf",
}

export interface IJobDescription extends Document {
  title: string;
  company?: string;
  description: string;
  inputType: JobDescriptionInputType;
  targetRole: Types.ObjectId;
  sourceUrl?: string;
  originalFileName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobDescriptionSchema = new Schema<IJobDescription>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    company: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 50,
      maxlength: 20000,
    },
    inputType: {
      type: String,
      enum: Object.values(JobDescriptionInputType),
      required: true,
    },
    targetRole: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
      maxlength: 2000,
    },
    originalFileName: {
      type: String,
      trim: true,
      maxlength: 255,
    },
  },
  { timestamps: true }
);

const JobDescription = model<IJobDescription>(
  "JobDescription",
  jobDescriptionSchema
);

export default JobDescription;
