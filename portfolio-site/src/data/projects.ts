interface Project {
  name: string;
  desc: string;
  link: string;
  image: string;
  caseStudy?: {
    problem: string;
    solution: string;
    impact: string;
    tech: string[];
  };
}

const projects: Project[] = [
  {
    name: "Aegis",
    desc: "DNS management platform for parental controls with real-time analytics and threat blocking.",
    link: "https://github.com/guy-with-a-cool-terminal",
    image: "/src/assets/securevault-project.jpg",
    caseStudy: {
      problem: "Parents need technical knowledge to protect children online using DNS filtering, creating barriers to digital safety.",
      solution: "Built a web-based platform that simplifies NextDNS management with automated threat blocking, real-time analytics, device management, and customizable filtering rules for non-technical users.",
      impact: "Production application with active users enabling parents to protect their children online without technical expertise. Features real-time monitoring and automated content blocking.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Django", "Django REST Framework", "PostgreSQL", "Supabase", "Redis", "Celery"]
    }
  },
  {
    name: "M-Pesa Payment Wrapper",
    desc: "Developer-friendly API wrapper for Kenya's Daraja payment system.",
    link: "https://github.com/guy-with-a-cool-terminal",
    image: "/src/assets/gititdone-project.jpg",
    caseStudy: {
      problem: "Integrating M-Pesa payments requires complex Daraja API knowledge, slowing down payment implementation for developers.",
      solution: "Created a streamlined API wrapper that simplifies M-Pesa integration through intuitive endpoints, automated registration, and reduced coding complexity.",
      impact: "Enables faster payment implementation for developers building Kenyan applications, reducing integration time from days to hours.",
      tech: ["Python", "Django", "REST APIs", "M-Pesa Daraja API", "Payment Processing"]
    }
  },
  {
    name: "School Voting System",
    desc: "Comprehensive voting platform serving 500+ students with real-time results.",
    link: "https://github.com/guy-with-a-cool-terminal",
    image: "/src/assets/portfolio-project.jpg",
    caseStudy: {
      problem: "Manual voting processes are slow, error-prone, and lack transparency for student elections.",
      solution: "Led a team of 10 developers to build a secure voting platform with authentication, real-time vote counting, administrative dashboard, and election management.",
      impact: "Successfully deployed for live school elections serving 500+ students with zero downtime. Delivered transparent, efficient elections with instant results.",
      tech: ["React", "Node.js", "PostgreSQL", "Authentication", "Real-time Processing"]
    }
  },
];

export default projects;
