"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Heart, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-white/5">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-slate-400 text-sm flex items-center justify-center sm:justify-start gap-1.5">
              Made with{" "}
              <Heart className="w-4 h-4 text-red-500 fill-red-500 inline" /> by{" "}
              <span className="text-slate-200 font-medium">
                Muhammad Areeb Khan
              </span>
            </p>
            <p className="text-slate-600 text-xs mt-1">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/areebkh5618-boop"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://www.linkedin.com/in/areeb-khan-866111341/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl glass text-slate-400 hover:text-white hover:bg-white/10 transition-all"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}
