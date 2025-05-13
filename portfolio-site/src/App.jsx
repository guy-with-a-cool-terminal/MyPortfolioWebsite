import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail } from 'lucide-react'; // Social media icons

// Social links
const socialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/guy-with-a-cool-terminal",
    icon: <Github className="w-6 h-6 text-blue-600 hover:text-blue-800 transition-all duration-300" />,
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/briannjuguna/",
    icon: <Linkedin className="w-6 h-6 text-blue-600 hover:text-blue-800 transition-all duration-300" />,
  },
  {
    platform: "Email",
    url: "mailto:njugunabriian@gmail.com",
    icon: <Mail className="w-6 h-6 text-blue-600 hover:text-blue-800 transition-all duration-300" />,
  },
];

const projects = [
  {
    name: "SecureVault",
    desc: "A password manager with GitHub secret scanning and encryption.",
    link: "https://github.com/guy-with-a-cool-terminal/securevault",
  },
  {
    name: "Portfolio Site",
    desc: "Personal portfolio site, showcasing my skills and work.",
    link: "https://github.com/guy-with-a-cool-terminal/portfolio",
  },
  {
    name: "GitItDone",
    desc: "A Git-Workflow automation, CLI Tool that speeds up your git workflow.",
    link: "https://github.com/guy-with-a-cool-terminal/taskflow",
  },
];

const App = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (Mock)");
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-100 min-h-screen font-inter flex flex-col">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div className="text-xl font-bold text-black">Brian Njuguna</div>
          <nav className="space-x-6">
            <a href="#about" className="text-lg text-black hover:text-gray-700 transition">About</a>
            <a href="#projects" className="text-lg text-black hover:text-gray-700 transition">Projects</a>
            <a href="#contact" className="text-lg text-black hover:text-gray-700 transition">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <motion.section
        id="hero"
        className="flex flex-col items-center justify-center px-6 py-16 text-center mt-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl sm:text-5xl font-semibold mb-6 text-gray-900">Hello, I'm Brian Njuguna</h1>
        <p className="text-lg sm:text-xl mb-6 max-w-2xl text-gray-800">
          I'm a software engineer passionate about backend development, cybersecurity, and building secure, scalable systems.
        </p>
        <a
          href="#projects"
          className="bg-gray-200 text-black px-6 py-3 rounded-lg shadow-md hover:bg-gray-300 transition"
        >
          Explore My Projects
        </a>
        {/* Elevator Pitch Section */}
        <p className="text-lg sm:text-xl mt-4 text-gray-800">
          I'm currently diving deep into the ALX backend program while enhancing my skills in cybersecurity and open-source contributions.
        </p>
      </motion.section>

      {/* About Section */}
      <motion.section
        id="about"
        className="py-16 px-6 bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-8">About Me</h2>
          <p className="text-lg text-gray-700 mb-4">
            I'm a backend engineer passionate about building secure and scalable systems. Currently diving deep into the ALX backend program while simultaneously enhancing my skills in cybersecurity.
          </p>
          <p className="text-lg text-gray-700">
            When I'm not coding, you can find me exploring Linux, system security, and contributing to open-source projects.
          </p>
          <a
            href="https://docs.google.com/document/d/1AzpAenefivF0MeBmlpGmeKgM94KQJhirmFFajVDQzu8/edit?usp=sharing"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg mt-4 inline-block hover:bg-blue-700 transition"
          >
            View My CV
          </a>
        </div>
      </motion.section>

      {/* Projects Section */}
      <motion.section
        id="projects"
        className="py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-8">Featured Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.6 }}
              >
                <h3 className="text-xl font-semibold text-blue-600 mb-4">{project.name}</h3>
                <p className="text-sm text-gray-700 mb-4">{project.desc}</p>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Project
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        id="contact"
        className="bg-white py-16 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0, delay: 0.3 }}
      >
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-8">Contact Me</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              placeholder="Your Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Your Message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </motion.section>

      {/* Social Links Section */}
      <motion.section
        id="social"
        className="bg-white py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-4">Connect with me</h3>
          <div className="flex justify-center space-x-8">
            {socialLinks.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition-all duration-300"
              >
                <div className="flex items-center space-x-2">
                  {link.icon}
                  <span className="text-lg">{link.platform}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-white text-center text-black py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <p className="text-sm">
          © {new Date().getFullYear()} Brian Njuguna. All rights reserved.
        </p>
      </motion.footer>
    </div>
  );
};

export default App;
