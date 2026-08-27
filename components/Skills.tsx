"use client";
import type { ComponentType } from "react";

import { motion } from "framer-motion";
import {
  Container,
  Ship,
  Terminal,
  GitBranch,
  Github,
  Workflow,
  GitPullRequest,
  Server,
  Globe,
  Atom,
  Palette,
  Zap,
  Database,
  Code2,
  FileCode,
  Code,
  Coffee,
  Binary,
} from "lucide-react";
import { useEffect, useState } from "react";
import { skills as fallbackSkills, type Skill } from "@/data/skills";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  Container,
  Ship,
  Terminal,
  GitBranch,
  Github,
  Workflow,
  GitPullRequest,
  Server,
  Globe,
  Atom,
  Palette,
  Zap,
  Database,
  Code2,
  FileCode,
  Code,
  Coffee,
  Binary,
};

const categoryColors: Record<string, string> = {
  devops: "from-blue-500/20 to-cyan-500/10 border-blue-500/20",
  frontend: "from-purple-500/20 to-pink-500/10 border-purple-500/20",
  backend: "from-green-500/20 to-emerald-500/10 border-green-500/20",
  languages: "from-orange-500/20 to-amber-500/10 border-orange-500/20",
  database: "from-cyan-500/20 to-teal-500/10 border-cyan-500/20",
};

const categoryLabels: Record<string, string> = {
  devops: "DevOps & Cloud",
  frontend: "Frontend",
  backend: "Backend",
  languages: "Languages",
  database: "Database",
};

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const categories = ["devops", "frontend", "backend", "languages", "database"];

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setSkills(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="skills" className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-secondary mb-4">
            Tech Stack
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Skills & <span className="gradient-text">Technologies</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto rounded-full" />
        </motion.div>

        <div className="space-y-10">
          {categories.map((cat, catIndex) => {
            const catSkills = skills.filter((s) => s.category === cat);
            return (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: catIndex * 0.1 }}
              >
                <h3 className="text-lg font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                  {categoryLabels[cat]}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {catSkills.map((skill, index) => {
                    const Icon = iconMap[skill.icon] || Code2;
                    return (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ scale: 1.05, y: -4 }}
                        className={`glass rounded-2xl p-4 flex flex-col items-center gap-3 bg-gradient-to-br ${categoryColors[cat]} border hover:shadow-lg hover:shadow-primary/10 transition-all cursor-default`}
                      >
                        <div className="p-2.5 rounded-xl bg-white/5">
                          <Icon className="w-6 h-6 text-slate-200" />
                        </div>
                        <span className="text-sm font-medium text-slate-200 text-center">
                          {skill.name}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
