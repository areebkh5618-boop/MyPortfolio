import { promises as fs } from "fs";
import path from "path";
import { projects as seedProjects, type Project } from "@/data/projects";
import { skills as seedSkills, type Skill } from "@/data/skills";

export type { Project, Skill };

export interface StoreData {
  projects: Project[];
  skills: Skill[];
  nextProjectId: number;
}

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

async function ensureStore(): Promise<StoreData> {
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

async function writeStore(data: StoreData) {
  await fs.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getProjects(): Promise<Project[]> {
  const data = await ensureStore();
  return data.projects;
}

export async function getSkills(): Promise<Skill[]> {
  const data = await ensureStore();
  return data.skills;
}

export async function addProject(
  input: Omit<Project, "id">
): Promise<Project> {
  const data = await ensureStore();
  const project: Project = { ...input, id: data.nextProjectId };
  data.nextProjectId += 1;
  data.projects.unshift(project);
  await writeStore(data);
  return project;
}

export async function updateProject(
  id: number,
  input: Partial<Omit<Project, "id">>
): Promise<Project | null> {
  const data = await ensureStore();
  const idx = data.projects.findIndex((p) => p.id === id);
  if (idx === -1) return null;
  data.projects[idx] = { ...data.projects[idx], ...input, id };
  await writeStore(data);
  return data.projects[idx];
}

export async function deleteProject(id: number): Promise<boolean> {
  const data = await ensureStore();
  const before = data.projects.length;
  data.projects = data.projects.filter((p) => p.id !== id);
  if (data.projects.length === before) return false;
  await writeStore(data);
  return true;
}

export async function addSkill(input: Skill): Promise<Skill> {
  const data = await ensureStore();
  if (data.skills.some((s) => s.name.toLowerCase() === input.name.toLowerCase())) {
    throw new Error("Skill already exists");
  }
  data.skills.push(input);
  await writeStore(data);
  return input;
}

export async function updateSkill(
  name: string,
  input: Partial<Skill>
): Promise<Skill | null> {
  const data = await ensureStore();
  const idx = data.skills.findIndex(
    (s) => s.name.toLowerCase() === name.toLowerCase()
  );
  if (idx === -1) return null;
  data.skills[idx] = { ...data.skills[idx], ...input };
  await writeStore(data);
  return data.skills[idx];
}

export async function deleteSkill(name: string): Promise<boolean> {
  const data = await ensureStore();
  const before = data.skills.length;
  data.skills = data.skills.filter(
    (s) => s.name.toLowerCase() !== name.toLowerCase()
  );
  if (data.skills.length === before) return false;
  await writeStore(data);
  return true;
}
