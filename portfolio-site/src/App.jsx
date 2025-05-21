import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

const socialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/guy-with-a-cool-terminal",
    icon: <Github className="w-6 h-6 text-teal-400 hover:text-teal-500 transition" />,
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/briannjuguna/",
    icon: <Linkedin className="w-6 h-6 text-teal-400 hover:text-teal-500 transition" />,
  },
  {
    platform: "Email",
    url: "mailto:njugunabriian@gmail.com",
    icon: <Mail className="w-6 h-6 text-teal-400 hover:text-teal-500 transition" />,
  },
];

const projects = [
  {
    name: "SecureVault",
    desc: "A password manager with GitHub secret scanning and encryption.",
    link: "https://secure-vault-bintech.vercel.app/",
  },
  {
    name: "Portfolio Site",
    desc: "Personal portfolio site, showcasing my skills and work.",
    link: "https://github.com/guy-with-a-cool-terminal/MyPortfolioWebsite",
  },
  {
    name: "GitItDone",
    desc: "A Git-Workflow automation, CLI Tool that speeds up your git workflow.",
    link: "https://github.com/guy-with-a-cool-terminal/GitItDoneAutomationTool",
  },
];

const App = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (Mock)");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-gray-300 font-sans flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 w-full bg-[#0F172A] backdrop-blur-md border-b border-teal-700 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-teal-400 cursor-default">Brian Njuguna</h1>
          <nav aria-label="Primary navigation" className="space-x-8 text-lg font-medium">
            <a href="#about" className="hover:text-teal-400 transition">
              About
            </a>
            <a href="#projects" className="hover:text-teal-400 transition">
              Projects
            </a>
            <a href="#contact" className="hover:text-teal-400 transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <motion.section
        id="hero"
        className="flex flex-col items-center justify-center text-center flex-grow mt-16 px-6"
        style={{ minHeight: "calc(100vh - 64px)" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9 }}
      >
        <h2 className="text-5xl font-extrabold leading-tight mb-6 text-teal-400">
          Hello, I'm Brian Njuguna
        </h2>
        <p className="text-xl max-w-3xl mb-10 leading-relaxed text-gray-400">
          Software engineer passionate about backend development, cybersecurity, and building secure,
          scalable systems.
        </p>
        <a
          href="#projects"
          className="inline-block bg-teal-500 hover:bg-teal-600 transition px-10 py-4 rounded-full font-semibold text-lg shadow-lg"
        >
          Explore My Projects
        </a>
        <p className="mt-10 max-w-3xl text-lg leading-relaxed text-gray-400">
          Currently diving deep into the ALX backend program while enhancing my skills in cybersecurity
          and open-source contributions.
        </p>
      </motion.section>

      {/* About (Services-like) */}
      <motion.section
        id="about"
        className="bg-[#112240] py-20 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-teal-400 text-center mb-14">About Me</h2>
          <div className="grid md:grid-cols-3 gap-12 text-center">
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Backend Engineer</h3>
              <p className="text-gray-400 leading-relaxed">
                Passionate about building secure and scalable backend systems.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Cybersecurity Enthusiast</h3>
              <p className="text-gray-400 leading-relaxed">
                Constantly improving knowledge on security best practices and open-source tools.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Open Source Contributor</h3>
              <p className="text-gray-400 leading-relaxed">
                Contributing to Linux and security projects to give back to the community.
              </p>
            </div>
          </div>
          <div className="text-center mt-12">
            <a
              href="https://docs.google.com/document/d/1AzpAenefivF0MeBmlpGmeKgM94KQJhirmFFajVDQzu8/edit?usp=sharing"
              className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-12 py-4 rounded-full font-semibold transition"
              target="_blank"
              rel="noopener noreferrer"
            >
              View My CV
            </a>
          </div>
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"
        className="py-20 px-6 max-w-7xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h2 className="text-4xl font-bold text-teal-400 text-center mb-16">Featured Projects</h2>
        <div className="grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, idx) => (
            <motion.a
              key={idx}
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-[#112240] p-8 rounded-lg shadow-lg border border-teal-700 hover:border-teal-500 transition transform hover:scale-[1.05]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 * idx, duration: 0.6 }}
              aria-label={`Project: ${project.name}`}
            >
              <h3 className="text-2xl font-semibold text-teal-400 mb-4">{project.name}</h3>
              <p className="text-gray-400">{project.desc}</p>
            </motion.a>
          ))}
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="bg-[#112240] py-20 px-6 flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <form
          onSubmit={handleSubmit}
          className="bg-[#0F172A] p-10 rounded-lg shadow-lg max-w-3xl w-full"
          aria-label="Contact form"
        >
          <h2 className="text-4xl font-bold mb-8 text-teal-400 text-center">Contact Me</h2>
          <div className="mb-8">
            <label htmlFor="name" className="block mb-3 font-semibold text-gray-400">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full px-5 py-4 bg-[#112240] border border-teal-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="email" className="block mb-3 font-semibold text-gray-400">
              Your Email
            </label>
            <input
              type="email"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="w-full px-5 py-4 bg-[#112240] border border-teal-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>
          <div className="mb-8">
            <label htmlFor="message" className="block mb-3 font-semibold text-gray-400">
              Your Message
            </label>
            <textarea
              id="message"
              rows="5"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
              className="w-full px-5 py-4 bg-[#112240] border border-teal-700 rounded-md text-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 hover:bg-teal-600 text-white py-4 rounded-full font-semibold transition"
          >
            Send Message
          </button>
        </form>
      </motion.section>

      {/* Social Links */}
      <motion.section
        id="social"
        className="bg-[#0F172A] py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-3xl font-bold mb-8 text-teal-400">Connect with me</h3>
          <div className="flex justify-center gap-16">
            {socialLinks.map(({ platform, url, icon }) => (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-3 text-teal-400 hover:text-teal-500 transition"
                aria-label={`Link to ${platform}`}
              >
                {icon}
                <span className="font-semibold text-lg">{platform}</span>
              </a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-[#0F172A] text-center text-gray-500 py-8 mt-auto border-t border-teal-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        <p className="text-sm">© {new Date().getFullYear()} Brian Njuguna. All rights reserved.</p>
      </motion.footer>
    </div>
  );
};

export default App;
