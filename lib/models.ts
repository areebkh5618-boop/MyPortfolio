import mongoose, { Schema, models, model } from "mongoose";

export interface IProject {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  tech: string[];
  github: string;
  live: string | null;
  image: string;
  featured?: boolean;
}

export interface ISkill {
  name: string;
  category: "devops" | "frontend" | "backend" | "languages" | "database";
  icon: string;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String, default: "" },
    tech: { type: [String], default: [] },
    github: { type: String, default: "" },
    live: { type: String, default: null },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["devops", "frontend", "backend", "languages", "database"],
      required: true,
    },
    icon: { type: String, default: "Code" },
  },
  { timestamps: true }
);

const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export const ProjectModel =
  models.Project || model<IProject>("Project", ProjectSchema);

export const SkillModel = models.Skill || model<ISkill>("Skill", SkillSchema);

export const CounterModel =
  models.Counter || model("Counter", CounterSchema);

export async function getNextProjectId(): Promise<number> {
  const counter = await CounterModel.findByIdAndUpdate(
    "projectId",
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq as number;
}
