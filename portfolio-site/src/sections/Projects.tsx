import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import projects from "../data/projects";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  return (
    <motion.section
      id="projects"
      className="py-20 px-6 max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
    >
      {/* SEO-friendly heading structure */}
      <div className="text-center mb-16">
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-mono bg-primary/10 text-primary border border-primary/30 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          aria-label="Projects section"
        >
          &lt;projects /&gt;
        </motion.span>
        <motion.h2
          className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Featured Projects
        </motion.h2>
        <motion.p
          className="text-muted-foreground max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          A selection of work I'm proud to put my name on.
        </motion.p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, idx) => (
          <motion.article
            key={project.name}
            className="group relative block rounded-xl overflow-hidden bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            itemScope
            itemType="https://schema.org/CreativeWork"
          >
            {/* Image - using imported paths from projects data */}
            <div className="relative h-48 overflow-hidden bg-muted">
              <img 
                src={project.image}
                alt={`${project.name} - ${project.desc.slice(0, 100)}`}
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                loading="lazy"
                itemProp="image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 
                  className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300"
                  itemProp="name"
                >
                  {project.name}
                </h3>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-all duration-300 transform hover:translate-x-1 hover:-translate-y-1"
                  aria-label={`View ${project.name} source code on GitHub`}
                  itemProp="url"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
              
              <p 
                className="text-muted-foreground text-sm leading-relaxed mb-4"
                itemProp="description"
              >
                {project.desc}
              </p>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 transition-all duration-300 hover:bg-primary/20 hover:scale-105"
                  aria-label={`View ${project.name} project repository`}
                >
                  <span className="text-xs font-mono text-primary">View Project</span>
                </a>
                {project.caseStudy && (
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 transition-all duration-300 hover:bg-secondary/20 hover:scale-105"
                    aria-label={`View ${project.name} case study`}
                  >
                    <span className="text-xs font-mono text-secondary">Case Study</span>
                  </button>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Case Study Modal */}
      <AnimatePresence>
        {selectedProject && selectedProject.caseStudy && (
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="case-study-title"
          >
            <motion.div
              className="glass max-w-2xl w-full rounded-xl p-8 border border-border/50 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{ boxShadow: 'var(--shadow-lg)' }}
            >
              <div className="flex justify-between items-start mb-6">
                <h3 
                  id="case-study-title" 
                  className="text-2xl font-bold text-foreground"
                >
                  {selectedProject.name}
                </h3>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-primary/10 rounded-lg"
                  aria-label="Close case study modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-primary mb-2">Problem</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.caseStudy.problem}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-secondary mb-2">Solution</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.caseStudy.solution}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-primary mb-2">Impact</h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProject.caseStudy.impact}
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-foreground mb-3">Tech Stack</h4>
                  <div className="flex flex-wrap gap-2" role="list">
                    {selectedProject.caseStudy.tech.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 text-sm rounded-lg bg-primary/10 text-primary border border-primary/20"
                        role="listitem"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <a
                  href={selectedProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-primary text-primary-foreground hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary mt-4"
                  aria-label={`View ${selectedProject.name} live project`}
                >
                  View Live Project
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default Projects;