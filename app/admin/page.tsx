"use client";

import { useCallback, useEffect, useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  FolderKanban,
  Wrench,
  Upload,
  X,
  Star,
  ExternalLink,
} from "lucide-react";

interface Project {
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

interface Skill {
  name: string;
  category: "devops" | "frontend" | "backend" | "languages" | "database";
  icon: string;
}

const CATEGORIES: Skill["category"][] = [
  "devops",
  "frontend",
  "backend",
  "languages",
  "database",
];

const EMPTY_PROJECT: Omit<Project, "id"> = {
  title: "",
  description: "",
  longDescription: "",
  tech: [],
  github: "",
  live: null,
  image: "",
  featured: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [tab, setTab] = useState<"projects" | "skills">("projects");
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Project form
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState(EMPTY_PROJECT);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Skill form
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState<Skill>({
    name: "",
    category: "frontend",
    icon: "Code",
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/projects", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }),
        fetch("/api/skills", {
          cache: "no-store",
          headers: { "Cache-Control": "no-cache" },
        }),
      ]);
      if (pRes.ok) setProjects(await pRes.json());
      if (sRes.ok) setSkills(await sRes.json());
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) {
          router.replace("/admin/login");
          return;
        }
        setAuthChecking(false);
        loadData();
      })
      .catch(() => router.replace("/admin/login"));
  }, [router, loadData]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
  }

  function openNewProject() {
    setEditingProject(null);
    setProjectForm(EMPTY_PROJECT);
    setTechInput("");
    setShowProjectForm(true);
  }

  function openEditProject(p: Project) {
    setEditingProject(p);
    setProjectForm({
      title: p.title,
      description: p.description,
      longDescription: p.longDescription,
      tech: p.tech,
      github: p.github,
      live: p.live,
      image: p.image,
      featured: p.featured,
    });
    setTechInput(p.tech.join(", "));
    setShowProjectForm(true);
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: fd,
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setProjectForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function saveProject(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = {
      ...projectForm,
      tech: techInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      live: projectForm.live || null,
    };
    try {
      const res = await fetch(`/api/projects?_t=${Date.now()}`, {
        method: editingProject ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(
          editingProject ? { id: editingProject.id, ...payload } : payload
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setShowProjectForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeProject(id: number) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects?id=${id}&_t=${Date.now()}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (res.ok) await loadData();
    else {
      const data = await res.json();
      setError(data.error || "Delete failed");
    }
  }

  function openNewSkill() {
    setEditingSkill(null);
    setSkillForm({ name: "", category: "frontend", icon: "Code" });
    setShowSkillForm(true);
  }

  function openEditSkill(s: Skill) {
    setEditingSkill(s);
    setSkillForm({ ...s });
    setShowSkillForm(true);
  }

  async function saveSkill(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/skills?_t=${Date.now()}`, {
        method: editingSkill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(
          editingSkill
            ? { originalName: editingSkill.name, ...skillForm }
            : skillForm
        ),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setShowSkillForm(false);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function removeSkill(name: string) {
    if (!confirm(`Delete skill "${name}"?`)) return;
    const res = await fetch(
      `/api/skills?name=${encodeURIComponent(name)}&_t=${Date.now()}`,
      {
        method: "DELETE",
        cache: "no-store",
      }
    );
    if (res.ok) await loadData();
    else {
      const data = await res.json();
      setError(data.error || "Delete failed");
    }
  }

  if (authChecking) {
    return (
      <div className="min-h-screen bg-[#0a0e17] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e17] text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0e17]/90 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="font-semibold text-sm sm:text-base">Portfolio Admin</h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Manage projects & skills
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition flex items-center gap-1"
            >
              View site <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={logout}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/40 transition flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError("")} className="text-red-300">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("projects")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              tab === "projects"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            <FolderKanban className="w-4 h-4" /> Projects ({projects.length})
          </button>
          <button
            onClick={() => setTab("skills")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-2 ${
              tab === "skills"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-white/5 text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            <Wrench className="w-4 h-4" /> Skills ({skills.length})
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
          </div>
        ) : tab === "projects" ? (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Projects</h2>
              <button
                onClick={openNewProject}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            <div className="grid gap-3">
              {projects.map((p) => (
                <div
                  key={p.id}
                  className="flex gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] transition"
                >
                  <div className="relative w-20 h-14 sm:w-28 sm:h-18 rounded-lg overflow-hidden bg-black/40 shrink-0 border border-white/5">
                    {p.image && (
                      <Image
                        src={p.image}
                        alt={p.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-medium flex items-center gap-1.5">
                          {p.title}
                          {p.featured && (
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          )}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                          {p.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {p.tech.slice(0, 5).map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => openEditProject(p)}
                          className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => removeProject(p.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <p className="text-center text-slate-500 py-12">No projects yet.</p>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Skills</h2>
              <button
                onClick={openNewSkill}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium hover:opacity-90"
              >
                <Plus className="w-4 h-4" /> Add Skill
              </button>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/[0.03]"
                >
                  <div>
                    <p className="font-medium text-sm">{s.name}</p>
                    <p className="text-xs text-slate-500 capitalize">
                      {s.category} · {s.icon}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => openEditSkill(s)}
                      className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-cyan-400"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removeSkill(s.name)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Project Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0f1520] shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#0f1520]">
              <h3 className="font-semibold">
                {editingProject ? "Edit Project" : "New Project"}
              </h3>
              <button
                onClick={() => setShowProjectForm(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveProject} className="p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Title *</label>
                <input
                  required
                  value={projectForm.title}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, title: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Short description *
                </label>
                <textarea
                  required
                  rows={2}
                  value={projectForm.description}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, description: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Long description
                </label>
                <textarea
                  rows={3}
                  value={projectForm.longDescription}
                  onChange={(e) =>
                    setProjectForm((f) => ({
                      ...f,
                      longDescription: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Tech (comma separated)
                </label>
                <input
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  placeholder="Next.js, React, Tailwind"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">GitHub URL</label>
                  <input
                    value={projectForm.github}
                    onChange={(e) =>
                      setProjectForm((f) => ({ ...f, github: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Live URL</label>
                  <input
                    value={projectForm.live || ""}
                    onChange={(e) =>
                      setProjectForm((f) => ({
                        ...f,
                        live: e.target.value || null,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Project image / poster
                </label>
                <div className="flex gap-2 items-start">
                  <input
                    value={projectForm.image}
                    onChange={(e) =>
                      setProjectForm((f) => ({ ...f, image: e.target.value }))
                    }
                    placeholder="/uploads/… or external URL"
                    className="flex-1 px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                  />
                  <label className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/5 text-sm cursor-pointer hover:bg-white/10">
                    {uploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                    Upload
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>
                {projectForm.image && (
                  <div className="relative w-full h-32 mt-2 rounded-xl overflow-hidden border border-white/10 bg-black/40">
                    <Image
                      src={projectForm.image}
                      alt="Preview"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!projectForm.featured}
                  onChange={(e) =>
                    setProjectForm((f) => ({ ...f, featured: e.target.checked }))
                  }
                  className="rounded border-white/20"
                />
                Featured project
              </label>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingProject ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Modal */}
      {showSkillForm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1520] shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="font-semibold">
                {editingSkill ? "Edit Skill" : "New Skill"}
              </h3>
              <button
                onClick={() => setShowSkillForm(false)}
                className="p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveSkill} className="p-5 space-y-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Name *</label>
                <input
                  required
                  value={skillForm.name}
                  onChange={(e) =>
                    setSkillForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Category</label>
                <select
                  value={skillForm.category}
                  onChange={(e) =>
                    setSkillForm((f) => ({
                      ...f,
                      category: e.target.value as Skill["category"],
                    }))
                  }
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">
                  Icon (Lucide name)
                </label>
                <input
                  value={skillForm.icon}
                  onChange={(e) =>
                    setSkillForm((f) => ({ ...f, icon: e.target.value }))
                  }
                  placeholder="Code, Database, Server…"
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:border-cyan-500/50"
                />
                <p className="text-[10px] text-slate-600 mt-1">
                  Must match a name already mapped in Skills.tsx (e.g. Docker →
                  Container)
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSkillForm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm hover:bg-white/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingSkill ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
