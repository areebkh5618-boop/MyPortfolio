import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
} from "@/lib/store";

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json(projects, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const project = await addProject({
      title: String(body.title || "").trim(),
      description: String(body.description || "").trim(),
      longDescription: String(body.longDescription || body.description || "").trim(),
      tech: Array.isArray(body.tech)
        ? body.tech.map(String)
        : String(body.tech || "")
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean),
      github: String(body.github || "").trim(),
      live: body.live ? String(body.live).trim() : null,
      image: String(body.image || "/images/projects/devops-os.svg").trim(),
      featured: Boolean(body.featured),
    });

    if (!project.title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    return NextResponse.json(project, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const id = Number(body.id);
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (body.title !== undefined) updates.title = String(body.title).trim();
    if (body.description !== undefined)
      updates.description = String(body.description).trim();
    if (body.longDescription !== undefined)
      updates.longDescription = String(body.longDescription).trim();
    if (body.tech !== undefined) {
      updates.tech = Array.isArray(body.tech)
        ? body.tech.map(String)
        : String(body.tech)
            .split(",")
            .map((t: string) => t.trim())
            .filter(Boolean);
    }
    if (body.github !== undefined) updates.github = String(body.github).trim();
    if (body.live !== undefined)
      updates.live = body.live ? String(body.live).trim() : null;
    if (body.image !== undefined) updates.image = String(body.image).trim();
    if (body.featured !== undefined) updates.featured = Boolean(body.featured);

    const project = await updateProject(id, updates);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    if (!id) {
      return NextResponse.json({ error: "id required" }, { status: 400 });
    }
    const ok = await deleteProject(id);
    if (!ok) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
