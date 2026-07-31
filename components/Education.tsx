"use client";

import { motion } from "framer-motion";
import { GraduationCap, Calendar, MapPin, BookOpen } from "lucide-react";

export default function Education() {
  return (
    <section id="education" className="py-20 md:py-28 relative">
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
            Academic
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Education</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent hidden sm:block" />

            <div className="glass rounded-2xl p-6 sm:p-8 sm:ml-12 relative border border-white/5 hover:border-primary/30 transition-colors">
              {/* Timeline dot */}
              <div className="absolute -left-[3.25rem] top-8 w-4 h-4 rounded-full bg-primary border-4 border-[#09090B] hidden sm:block glow-primary" />

              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 w-fit">
                  <GraduationCap className="w-8 h-8 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    BS Computer Science
                  </h3>
                  <p className="text-lg text-primary font-medium mb-3">
                    University of Engineering and Technology Lahore
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-4">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-accent" />
                      2024 — 2028
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-secondary" />
                      Lahore, Pakistan
                    </span>
                  </div>

                  <div className="flex items-start gap-2 text-slate-400 text-sm leading-relaxed">
                    <BookOpen className="w-4 h-4 mt-0.5 text-slate-500 shrink-0" />
                    <p>
                      Pursuing a comprehensive curriculum covering algorithms,
                      data structures, software engineering, computer networks,
                      operating systems, and cloud technologies. Actively
                      exploring DevOps practices and modern deployment
                      strategies alongside academic coursework.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
