import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
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
            className="group relative block rounded-2xl overflow-hidden border border-white/10 shadow-2xl h-[450px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * idx, duration: 0.5 }}
            whileHover={{ y: -5 }}
            itemScope
            itemType="https://schema.org/CreativeWork"
          >
            {/* Background Image & Overlay */}
            <div className="absolute inset-0 z-0 h-full w-full">
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent opacity-90" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 p-8 h-full flex flex-col justify-end">
              <div className="transform transition-transform duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300"
                    itemProp="name"
                  >
                    {project.name}
                  </h3>
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/70 hover:text-primary transition-colors"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </a>
                </div>

                <p
                  className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-3 group-hover:text-white transition-colors"
                  itemProp="description"
                >
                  {project.desc}
                </p>

                {/* Action buttons */}
                <div className="flex items-center gap-3 opacity-0 transform translate-y-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  >
                    View Project
                  </a>
                  {project.caseStudy && (
                    <button
                      onClick={() => setSelectedProject(project)}
                      className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm transition-all hover:bg-white/20 hover:scale-105"
                    >
                      Case Study
                    </button>
                  )}
                </div>
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