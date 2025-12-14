import safeariImg from '../assets/childontab.webp';
import paymentImg from '../assets/paymentimage1.webp';
import gitImg from '../assets/gitautomation.png';

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
    name: "Safeari",
    desc: "A modern web application that makes DNS-based parental controls accessible to everyone. Built with Django, React, TypeScript, and shadcn/ui, it provides families with an intuitive interface to manage content filtering, set time restrictions, and monitor internet usage across all devices - no technical knowledge required",
    link: "https://github.com/guy-with-a-cool-terminal",
    image: safeariImg,
    caseStudy: {
      problem: "Parents need technical knowledge to protect children online using DNS filtering, creating barriers to digital safety.",
      solution: "Built a web-based platform that simplifies NextDNS management with automated threat blocking, real-time analytics, device management, and customizable filtering rules for non-technical users.",
      impact: "Production application with active users enabling parents to protect their children online without technical expertise. Features real-time monitoring and automated content blocking.",
      tech: ["React", "TypeScript", "Tailwind CSS", "Django", "Django REST Framework", "PostgreSQL", "Supabase", "Redis", "Celery","Resend","Paystack"]
    }
  },
  {
    name: "Multi-Provider Payment API",
    desc: "Unified payment infrastructure supporting M-Pesa, Paystack, and card processors with built-in invoicing and subscription management.",
    link: "https://github.com/guy-with-a-cool-terminal",
    image: paymentImg,
    caseStudy: {
      problem: "Clients need flexible payment solutions across different providers (cards, M-Pesa, etc.) without rebuilding infrastructure for each project.",
      solution: "Built a containerized payment API that supports multiple providers through unified endpoints. Includes automated invoicing, subscription billing for SaaS products, and per-client container deployment with isolated API keys.",
      impact: "Reduced client payment system deployment from weeks to 3 hours. Serves production traffic with Paystack as primary provider and M-Pesa for local transactions. Clients get full payment infrastructure: processing, invoicing, and subscriptions out of the box.",
      tech: ["Python", "Django", "Docker", "Paystack API", "M-Pesa Daraja", "REST APIs", "Subscription Billing"]
    }
  },
  {
    name: "GitItDone",
    desc: "A lightweight Python tool that automates Git commits and pushes. With customizable commit messages and remote support, it simplifies your workflow, saving time and effort. Perfect for developers who want a faster, hassle-free Git experience!",
    link: "https://github.com/guy-with-a-cool-terminal/GitItDoneAutomationTool",
    image: gitImg,
    caseStudy: {
      problem: "Developers waste time on repetitive Git commands, typing the same commit messages and push commands for routine updates, breaking focus from actual coding work.",
      solution: "Built a Python automation tool that streamlines the Git workflow with one-command commits and pushes, customizable commit message templates, and smart remote repository detection.",
      impact: "Reduced Git workflow time by 70% for routine commits. Open-sourced on GitHub for the developer community to use and contribute to.",
      tech: ["Python", "Git", "CLI", "Automation", "Shell Scripting"]
    }
  }
];

export default projects;
