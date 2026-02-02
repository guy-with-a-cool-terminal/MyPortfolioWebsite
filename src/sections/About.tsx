import { useState } from 'react';
import { motion } from "framer-motion";
import { Code2, Zap, Layers, Server } from "lucide-react";
import CVModal from '../components/CVModal';
import GitHubActivity from '../components/GitHubActivity';

const aboutData = {
  intro: "I'm a fullstack developer specializing in web applications and e-commerce solutions. I build production systems with Python, Django, React, and TypeScript.",
  philosophy: [
    "Write maintainable code. Keep it simple.",
    "Security isn't optional—it's built in from the start.",
    "Good fundamentals matter more than framework hype."
  ],
  mission: [
    "Build systems that handle complexity behind simple interfaces.",
    "Ship production code that solves real business problems.",
    "Contribute to open source—software should be accessible."
  ],
  services: [
    { icon: Server, label: "Backend systems & REST APIs" },
    { icon: Zap, label: "Third-party integrations (payments, email, SMS)" },
    { icon: Layers, label: "Fullstack web applications" },
    { icon: Code2, label: "Database design & optimization" }
  ],
  skills: [
    "Django", "Django REST", "Python", "Node.js", "Express.js",
    "React", "TypeScript", "Tailwind CSS", "PostgreSQL", "Docker",
    "Redis", "Celery", "AWS", "Git", "Linux"
  ]
};

const About = () => {
  const [showCV, setShowCV] = useState(false);

  return (
    <section
      id="about"
      className="bg-background text-foreground py-12 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold bg-primary/10 text-primary border border-primary/30 mb-3">
            About
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-2">
            What I Build
          </h2>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Intro Card */}
          <motion.div
            className="md:col-span-2 glass p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="flex items-start gap-4">
              <Code2 className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
              <p className="text-lg text-foreground/90 leading-relaxed">
                {aboutData.intro}
              </p>
            </div>
          </motion.div>

          {/* Philosophy Card */}
          <motion.div
            className="glass p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <h3 className="text-xl font-semibold text-primary mb-4">
              Philosophy
            </h3>
            <ul className="space-y-3">
              {aboutData.philosophy.map((item, idx) => (
                <li key={idx} className="text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1.5 text-xs">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Mission Card */}
          <motion.div
            className="glass p-8 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-500"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <h3 className="text-xl font-semibold text-secondary mb-4">
              Mission
            </h3>
            <ul className="space-y-3">
              {aboutData.mission.map((item, idx) => (
                <li key={idx} className="text-muted-foreground flex items-start gap-2">
                  <span className="text-secondary mt-1.5 text-xs">▸</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Services Grid */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-foreground mb-6">What I Offer</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {aboutData.services.map((service, idx) => (
              <motion.div
                key={idx}
                className="glass p-6 rounded-xl border border-border/50 hover:border-primary/40 transition-all duration-300 group cursor-default"
                whileHover={{ y: -4 }}
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <service.icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform duration-300" />
                <p className="text-sm text-foreground/80">{service.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skills Compact - Clean, Icon-based */}
        <motion.div
          className="mt-12 mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
            Core Stack
          </h3>

          <div className="flex flex-wrap gap-8 items-center justify-start">
            {[
              { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
              { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', invert: true },
              { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
              { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
              { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
              { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
              { name: 'Redis', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
              { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', invert: true },
              { name: 'Tailwind', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg', invert: true },
            ].map((skill, idx) => (
              <motion.div
                key={idx}
                className="flex flex-col items-center gap-3 group"
                whileHover={{ y: -5 }}
              >
                <div className="w-12 h-12 flex items-center justify-center transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                  <img
                    src={skill.icon}
                    alt={skill.name}
                    className={`w-full h-full object-contain ${skill.invert ? 'brightness-0 invert' : ''}`}
                  />
                </div>
                {/* Label: Always visible */}
                <span className="text-sm font-medium text-gray-300 group-hover:text-primary transition-colors">
                  {skill.name}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* GitHub Activity */}
        <GitHubActivity />

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button
            onClick={() => setShowCV(true)}
            className="inline-block px-8 py-4 rounded-xl font-semibold transition-all duration-300 bg-primary text-primary-foreground hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary shadow-lg"
          >
            View My CV
          </button>
        </motion.div>

        {/* CV Modal */}
        <CVModal isOpen={showCV} onClose={() => setShowCV(false)} />
      </div>
    </section>
  );
};

export default About;