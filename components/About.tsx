"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Cloud,
  Container,
  GitBranch,
  Server,
  Terminal,
  Sparkles,
} from "lucide-react";

const highlights = [
  { icon: Container, label: "Docker", color: "text-blue-400" },
  { icon: Cloud, label: "Kubernetes", color: "text-purple-400" },
  { icon: GitBranch, label: "CI/CD", color: "text-cyan-400" },
  { icon: Terminal, label: "Linux", color: "text-green-400" },
  { icon: Server, label: "Automation", color: "text-orange-400" },
  { icon: Code2, label: "Cloud Computing", color: "text-pink-400" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section id="about" className="py-20 md:py-28 relative">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full glass text-sm text-primary mb-4">
            About Me
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Who I <span className="gradient-text">Am</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 md:p-8">
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-4">
                I am a{" "}
                <span className="text-primary font-semibold">
                  Computer Science student
                </span>{" "}
                at the University of Engineering and Technology Lahore,
                passionate about{" "}
                <span className="text-secondary font-semibold">
                  DevOps, Cloud Computing, Docker, Kubernetes
                </span>{" "}
                and Automation.
              </p>
              <p className="text-slate-400 leading-relaxed">
                Currently working as a{" "}
                <span className="text-accent font-semibold">
                  DevOps Engineer at Transcure
                </span>{" "}
                and open to new opportunities where I can contribute, grow, and
                work with cutting-edge cloud and DevOps technologies.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span>Always learning</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm"
              >
                <Sparkles className="w-4 h-4 text-secondary" />
                <span>Always building</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm"
              >
                <Sparkles className="w-4 h-4 text-accent" />
                <span>Always improving</span>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-4"
          >
            {highlights.map((h) => (
              <motion.div
                key={h.label}
                variants={item}
                whileHover={{ scale: 1.05, y: -4 }}
                className="glass rounded-2xl p-5 flex flex-col items-center gap-3 text-center hover:border-primary/30 transition-colors cursor-default"
              >
                <div className={`p-3 rounded-xl bg-white/5 ${h.color}`}>
                  <h.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-slate-200">
                  {h.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
