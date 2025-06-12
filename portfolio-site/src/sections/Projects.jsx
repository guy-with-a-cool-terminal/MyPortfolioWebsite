import React from "react";
import { motion } from "framer-motion";
import projects from "../data/projects";

const Projects = () => (
  <motion.section
    id="projects"
    className="py-20 px-6 max-w-7xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.3 }}
  >
    <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 text-center mb-16">
      Featured Projects
    </h2>
    <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map(({ name, desc, link }, idx) => (
        <motion.a
          key={name}
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#112240] p-8 rounded-lg shadow-lg border border-teal-700 hover:border-teal-500 transition transform hover:scale-[1.05] focus:outline-none focus:ring-2 focus:ring-teal-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 * idx, duration: 0.6 }}
          aria-label={`Project: ${name}`}
        >
          <h3 className="text-xl sm:text-2xl font-semibold text-teal-400 mb-4">{name}</h3>
          <p className="text-gray-400">{desc}</p>
        </motion.a>
      ))}
    </div>
  </motion.section>
);

export default Projects;
