import React from "react";
import { motion } from "framer-motion";
import { Code2, Database, Shield, Wrench, Cloud, Layout } from "lucide-react";

const skills = [
  {
    category: "Programming",
    icon: Code2,
    items: ["Python", "JavaScript/TypeScript", "Django", "Node.js", "React"],
  },
  {
    category: "Backend & APIs",
    icon: Database,
    items: ["Django REST Framework", "Express.js", "REST APIs", "Celery", "Redis"],
  },
  {
    category: "Database",
    icon: Database,
    items: ["PostgreSQL", "Supabase", "Django ORM", "Query Optimization"],
  },
  {
    category: "DevOps & Cloud",
    icon: Cloud,
    items: ["Docker", "Kubernetes", "Jenkins", "AWS", "DigitalOcean", "CI/CD"],
  },
  {
    category: "Tools",
    icon: Wrench,
    items: ["Git/GitHub", "Bash Scripting", "Linux", "Postman"],
  },
  {
    category: "Security",
    icon: Shield,
    items: ["Penetration Testing", "TryHackMe", "Hack The Box", "Security Best Practices"],
  },
];

const Skills = () => (
  <motion.section
    id="skills"
    className="py-20 px-6 max-w-7xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
  >
    <div className="text-center mb-16">
      <motion.span
        className="inline-block px-4 py-1.5 rounded-full text-sm font-mono bg-primary/10 text-primary border border-primary/20 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        &lt;skills /&gt;
      </motion.span>
      <motion.h2
        className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Technical Expertise
      </motion.h2>
    </div>

    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map(({ category, icon: Icon, items }, idx) => (
        <motion.div
          key={category}
          className="p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-all duration-500 hover:-translate-y-1 hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * idx, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10 transition-all duration-300 hover:bg-primary/20 hover:rotate-6">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">{category}</h3>
          </div>
          <ul className="space-y-2">
            {items.map((item) => (
              <motion.li
                key={item}
                className="text-sm text-muted-foreground flex items-center gap-2 transition-all duration-300 hover:text-foreground hover:translate-x-1 cursor-default"
                whileHover={{ x: 4 }}
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 transition-all duration-300 hover:w-1.5 hover:h-1.5" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  </motion.section>
);

export default Skills;
