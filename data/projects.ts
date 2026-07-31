export interface Project {
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

export const projects: Project[] = [
  {
    id: 1,
    title: "Explore Pakistan Tours",
    description:
      "Travel web app to explore Pakistan destinations, tour packages, and trip planning with a clean modern UI.",
    longDescription:
      "Explore Pakistan Tours is a modern travel web application that helps users discover destinations across Pakistan, browse tour packages, and plan trips with an intuitive interface. The app focuses on smooth browsing experience, responsive design, and clear presentation of travel information so users can explore places and packages easily. Live demo is available for full walkthrough of the experience.",
    tech: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    github: "https://github.com/areebkh5618-boop",
    live: "https://explorespakistan.vercel.app/",
    image: "/images/projects/explore-pakistan.svg",
    featured: true,
  },
  {
    id: 2,
    title: "ZyroFit",
    description:
      "Modern full-stack ecommerce platform for fitness products with catalog, cart, authentication, and order management.",
    longDescription:
      "ZyroFit is a complete ecommerce solution built for fitness brands. It includes product catalog browsing, shopping cart, user authentication, and order management. The stack uses Next.js on the frontend, MongoDB for data, Docker for containerization, GitHub Actions for CI/CD, and Nginx as a reverse proxy for production deployment. The project focuses on scalable architecture, clean UI, and automated delivery pipelines so features can ship reliably from commit to production.",
    tech: ["Next.js", "MongoDB", "Docker", "GitHub Actions", "Nginx"],
    github: "https://github.com/areebkh5618-boop",
    live: null,
    image: "/images/projects/zyrofit.svg",
    featured: true,
  },
  {
    id: 3,
    title: "AI DevOps Agent",
    description:
      "Intelligent DevOps automation agent powered by Gemini AI that turns natural language into Docker and Kubernetes operations.",
    longDescription:
      "AI DevOps Agent bridges natural language and infrastructure. Built in Python, it uses Gemini AI to interpret commands and execute Docker and Kubernetes operations. Ideal for automating routine DevOps tasks, reducing manual YAML work, and helping teams move faster with conversational infrastructure control. The agent can assist with container lifecycle, cluster operations, and repeatable automation flows while keeping the interface simple and human-friendly.",
    tech: ["Python", "Docker", "Kubernetes", "Gemini AI"],
    github: "https://github.com/areebkh5618-boop",
    live: null,
    image: "/images/projects/ai-devops.svg",
    featured: true,
  },
  {
    id: 4,
    title: "Ride Sharing System",
    description:
      "Console-based ride sharing app in C++ focused on efficient data structures and algorithms for matching and routing.",
    longDescription:
      "A console ride-sharing system implemented in C++ with emphasis on data structures and algorithms. Handles rider–driver matching, route optimization, and efficient lookups. Built to practice core CS fundamentals while modeling a real-world mobility problem end to end — including assignment logic, priority handling, and performance-minded design choices suitable for academic and interview-level problem solving.",
    tech: ["C++", "Data Structures", "Algorithms"],
    github: "https://github.com/areebkh5618-boop",
    live: null,
    image: "/images/projects/ride-sharing.svg",
  },
  {
    id: 5,
    title: "Brewista Cafe",
    description:
      "Full cafe management system with menu, orders, inventory, and reporting using ASP.NET and Oracle Database.",
    longDescription:
      "Brewista Cafe is an end-to-end management system for cafe operations. It covers menu management, order processing, inventory tracking, and reporting. Built with ASP.NET and Oracle Database for reliable enterprise-grade data handling and business workflows. The system is structured around real operational needs: daily sales, stock control, and clear reporting for decision-making.",
    tech: ["ASP.NET", "Oracle Database", "C#"],
    github: "https://github.com/areebkh5618-boop",
    live: null,
    image: "/images/projects/brewista.svg",
  },
  {
    id: 6,
    title: "Malware Detector",
    description:
      "Machine learning based malware detection that classifies threats from file features using supervised learning models.",
    longDescription:
      "A Python machine learning system that detects malware by analyzing file features and behavioral patterns. Uses supervised learning models to classify samples with high accuracy. Built to explore applied ML in cybersecurity and practical threat detection pipelines — from feature extraction to model evaluation and classification of potentially malicious files.",
    tech: ["Python", "Machine Learning", "Scikit-learn"],
    github: "https://github.com/areebkh5618-boop",
    live: null,
    image: "/images/projects/malware-detector.svg",
  },
];
