import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  type Skill,
} from "@/lib/store";

const VALID_CATEGORIES = [
  "devops",
  "frontend",
  "backend",
  "languages",
  "database",
] as const;

export async function GET() {
  try {
    const skills = await getSkills();
    return NextResponse.json(skills);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load skills" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const category = String(body.category || "frontend").trim() as Skill["category"];
    const icon = String(body.icon || "Code").trim();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
      return NextResponse.json(
        { error: `category must be one of: ${VALID_CATEGORIES.join(", ")}` },
        { status: 400 }
      );
    }

    const skill = await addSkill({ name, category, icon });
    return NextResponse.json(skill, { status: 201 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to create skill";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const originalName = String(body.originalName || body.name || "").trim();
    if (!originalName) {
      return NextResponse.json({ error: "originalName required" }, { status: 400 });
    }

    const updates: Partial<Skill> = {};
    if (body.name !== undefined) updates.name = String(body.name).trim();
    if (body.category !== undefined) {
      const cat = String(body.category).trim() as Skill["category"];
      if (!VALID_CATEGORIES.includes(cat as (typeof VALID_CATEGORIES)[number])) {
        return NextResponse.json({ error: "Invalid category" }, { status: 400 });
      }
      updates.category = cat;
    }
    if (body.icon !== undefined) updates.icon = String(body.icon).trim();

    const skill = await updateSkill(originalName, updates);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update skill" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get("name");
    if (!name) {
      return NextResponse.json({ error: "name required" }, { status: 400 });
    }
    const ok = await deleteSkill(name);
    if (!ok) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
