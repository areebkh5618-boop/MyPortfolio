import { promises as fs } from "fs";
import path from "path";
import { projects as seedProjects, type Project } from "@/data/projects";
import { skills as seedSkills, type Skill } from "@/data/skills";
import { isMongoConfigured, connectDB } from "@/lib/mongodb";
import {
  ProjectModel,
  SkillModel,
  getNextProjectId,
  type IProject,
  type ISkill,
} from "@/lib/models";

export type { Project, Skill };

/* ------------------------------------------------------------------ */
/*  File-based fallback (local / no MONGODB_URI)                        */
/* ------------------------------------------------------------------ */

interface StoreData {
  projects: Project[];
  skills: Skill[];
  nextProjectId: number;
}

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

async function ensureFileStore(): Promise<StoreData> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoreData;
  } catch {
    const maxId = seedProjects.reduce((m, p) => Math.max(m, p.id), 0);
    const data: StoreData = {
      projects: seedProjects,
      skills: seedSkills,
      nextProjectId: maxId + 1,
    };
    await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
    return data;
  }
}

async function writeFileStore(data: StoreData) {
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/* ------------------------------------------------------------------ */
/*  Mongo seed (runs once when collections are empty)                   */
/* ------------------------------------------------------------------ */

async function seedMongoIfEmpty() {
  await connectDB();
  const projectCount = await ProjectModel.countDocuments();
  if (projectCount === 0) {
    await ProjectModel.insertMany(seedProjects);
    const maxId = seedProjects.reduce((m, p) => Math.max(m, p.id), 0);
    const { CounterModel } = await import("@/lib/models");
    await CounterModel.findByIdAndUpdate(
      "projectId",
      { seq: maxId },
      { upsert: true }
    );
  }
  const skillCount = await SkillModel.countDocuments();
  if (skillCount === 0) {
    await SkillModel.insertMany(seedSkills);
  }
}

function toProject(doc: IProject): Project {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.description,
    longDescription: doc.longDescription,
    tech: doc.tech || [],
    github: doc.github || "",
    live: doc.live ?? null,
    image: doc.image || "",
    featured: doc.featured,
  };
}

function toSkill(doc: ISkill): Skill {
  return {
    name: doc.name,
    category: doc.category,
    icon: doc.icon,
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                          */
/* ------------------------------------------------------------------ */

export async function getProjects(): Promise<Project[]> {
  if (isMongoConfigured()) {
    await seedMongoIfEmpty();
    const docs = await ProjectModel.find().sort({ id: -1 }).lean();
    return docs.map((d) => toProject(d as IProject));
  }
  const data = await ensureFileStore();
  return data.projects;
}

export async function getSkills(): Promise<Skill[]> {
  if (isMongoConfigured()) {
    await seedMongoIfEmpty();
    const docs = await SkillModel.find().sort({ name: 1 }).lean();
    return docs.map((d) => toSkill(d as ISkill));
  }
  const data = await ensureFileStore();
  return data.skills;
}

export async function addProject(
  input: Omit<Project, "id">
): Promise<Project> {
  if (isMongoConfigured()) {
    await connectDB();
    const id = await getNextProjectId();
    const doc = await ProjectModel.create({ ...input, id });
    return toProject(doc.toObject());
  }
  const data = await ensureFileStore();
  const project: Project = { ...input, id: data.nextProjectId };
  data.nextProjectId += 1;
  data.projects.unshift(project);
  await writeFileStore(data);
  return project;
}

export async function updateProject(
  id: number,
  input: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  if (isMongoConfigured()) {
    await connectDB();
    const doc = await ProjectModel.findOneAndUpdate(
      { id },
      { $set: input },
      { new: true }
    ).lean();
    return doc ? toProject(doc as IProject) : null;
  }
  const data = await ensureFileStore();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.projects[idx] = { ...data.projects[idx], ...input, id };
  await writeFileStore(data);
  return data.projects[idx];
}

export async function deleteProject(id: number): Promise<boolean> {
  if (isMongoConfigured()) {
    await connectDB();
    const res = await ProjectModel.deleteOne({ id });
    return res.deletedCount > 0;
  }
  const data = await ensureFileStore();
  const before = data.projects.length;
  data.projects = data.projects.filter((p) => p.id !== id);
  if (data.projects.length === before) return false;
  await writeFileStore(data);
  return true;
}

export async function addSkill(input: Skill): Promise<Skill> {
  if (isMongoConfigured()) {
    await connectDB();
    const exists = await SkillModel.findOne({
      name: { $regex: new RegExp(`^${input.name}$`, "i") },
    });
    if (exists) throw new Error("Skill already exists");
    const doc = await SkillModel.create(input);
    return toSkill(doc.toObject());
  }
  const data = await ensureFileStore();
  if (data.skills.some((s) => s.name.toLowerCase() === input.name.toLowerCase())) {
    throw new Error("Skill already exists");
  }
  data.skills.push(input);
  await writeFileStore(data);
  return input;
}

export async function updateSkill(
  name: string,
  input: Partial<Skill>
): Promise<Skill | null> {
  if (isMongoConfigured()) {
    await connectDB();
    const doc = await SkillModel.findOneAndUpdate(
      { name: { $regex: new RegExp(`^${name}$`, "i") } },
      { $set: input },
      { new: true }
    ).lean();
    return doc ? toSkill(doc as ISkill) : null;
  }
  const data = await ensureFileStore();
  const idx = data.skills.findIndex(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  if (idx === -1) return null;
  data.skills[idx] = { ...data.skills[idx], ...input };
  await writeFileStore(data);
  return data.skills[idx];
}

export async function deleteSkill(name: string): Promise<boolean> {
  if (isMongoConfigured()) {
    await connectDB();
    const res = await SkillModel.deleteOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    return res.deletedCount > 0;
  }
  const data = await ensureFileStore();
  const before = data.skills.length;
  data.skills = data.skills.filter(
    (s) => s.name.toLowerCase() !== name.toLowerCase()
  );
  if (data.skills.length === before) return false;
  await writeFileStore(data);
  return true;
}
