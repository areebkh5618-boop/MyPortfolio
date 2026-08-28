export interface Skill {
  name: string;
  category: "devops" | "frontend" | "backend" | "languages" | "database";
  icon: string;
}

export const skills: Skill[] = [
  { name: "Docker", category: "devops", icon: "Container" },
  { name: "Kubernetes", category: "devops", icon: "Ship" },
  { name: "Linux", category: "devops", icon: "Terminal" },
  { name: "Git", category: "devops", icon: "GitBranch" },
  { name: "GitHub", category: "devops", icon: "Github" },
  { name: "GitHub Actions", category: "devops", icon: "Workflow" },
  { name: "CI/CD", category: "devops", icon: "GitPullRequest" },
  { name: "Nginx", category: "devops", icon: "Server" },
  { name: "Next.js", category: "frontend", icon: "Globe" },
  { name: "React", category: "frontend", icon: "Atom" },
  { name: "Tailwind CSS", category: "frontend", icon: "Palette" },
  { name: "Node.js", category: "backend", icon: "Server" },
  { name: "Express.js", category: "backend", icon: "Zap" },
  { name: "MongoDB", category: "database", icon: "Database" },
  { name: "Oracle SQL", category: "database", icon: "Database" },
  { name: "JavaScript", category: "languages", icon: "Code2" },
  { name: "TypeScript", category: "languages", icon: "FileCode" },
  { name: "Python", category: "languages", icon: "Code" },
  { name: "Java", category: "languages", icon: "Coffee" },
  { name: "C++", category: "languages", icon: "Binary" },
];
