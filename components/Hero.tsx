"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Download, Github, Linkedin, MapPin } from "lucide-react";
import Image from "next/image";

const roles = [
  "Computer Science Student",
  "DevOps Enthusiast",
  "Cloud Learner",
];

export default function Hero() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1800);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, roleIndex]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-slate-300 mb-6"
            >
              <MapPin className="w-3.5 h-3.5 text-accent" />
              Lahore, Pakistan
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-4">
              <span className="text-white">Muhammad</span>
              <br />
              <span className="gradient-text">Areeb Khan</span>
            </h1>

            <div className="h-10 sm:h-12 mb-6">
              <p className="text-xl sm:text-2xl text-slate-300 font-medium">
                <span className="text-primary">{displayText}</span>
                <span className="inline-block w-0.5 h-6 sm:h-7 bg-primary ml-1 animate-pulse align-middle" />
              </p>
            </div>

            <p className="text-slate-400 text-base sm:text-lg max-w-lg mb-8 leading-relaxed">
              Passionate about DevOps, Cloud Computing, Docker, Kubernetes and
              Automation. Building scalable applications and deploying modern
              software.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <motion.a
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg shadow-primary/25 overflow-hidden group"
              >
                <span className="relative z-10">View Projects</span>
                <ArrowDown className="w-4 h-4 relative z-10 group-hover:translate-y-0.5 transition-transform" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </motion.a>

              <motion.a
                href="/resume-muhammad-areeb-khan.pdf"
                download="Muhammad-Areeb-Khan-Resume.pdf"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass border border-white/10 text-slate-200 font-medium hover:border-primary/40 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </motion.a>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://github.com/areebkh5618-boop"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/areeb-khan-866111341/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl glass hover:bg-white/10 text-slate-300 hover:text-white transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent rounded-full blur-2xl opacity-40 animate-pulse-glow" />
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white/10 glow-primary"
              >
                <Image
                  src="/images/profile.png"
                  alt="Muhammad Areeb Khan"
                  fill
                  className="object-cover object-top"
                  priority
                  sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 384px"
                />
              </motion.div>
              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-full border border-primary/20 pointer-events-none" />
              <div className="absolute -inset-8 rounded-full border border-secondary/10 pointer-events-none" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
