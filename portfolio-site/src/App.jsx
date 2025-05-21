import React, { useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Menu, X } from "lucide-react";

const socialLinks = [
  {
    platform: "GitHub",
    url: "https://github.com/guy-with-a-cool-terminal",
    icon: <Github className="w-6 h-6" />,
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/briannjuguna/",
    icon: <Linkedin className="w-6 h-6" />,
  },
  {
    platform: "Email",
    url: "mailto:njugunabriian@gmail.com",
    icon: <Mail className="w-6 h-6" />,
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

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full bg-[#0F172A] backdrop-blur-md border-b border-teal-700 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-bold text-teal-400 cursor-default select-none">
          Brian Njuguna
        </h1>
        <nav aria-label="Primary navigation" className="hidden md:flex space-x-8 text-lg font-medium">
          <a href="#about" className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
            About
          </a>
          <a href="#projects" className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
            Projects
          </a>
          <a href="#contact" className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 rounded">
            Contact
          </a>
        </nav>
        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 rounded p-1"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <nav
        className={`md:hidden bg-[#0F172A] border-t border-teal-700 transition-max-height duration-300 ease-in-out overflow-hidden w-full max-w-full ${
          isOpen ? "max-h-48" : "max-h-0"
        }`}
        aria-label="Mobile Primary navigation"
      >
        <div className="flex flex-col px-6 py-4 space-y-4 text-lg font-medium w-full max-w-full">
          <a
            href="#about"
            onClick={() => setIsOpen(false)}
            className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
          >
            About
          </a>
          <a
            href="#projects"
            onClick={() => setIsOpen(false)}
            className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
          >
            Projects
          </a>
          <a
            href="#contact"
            onClick={() => setIsOpen(false)}
            className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 rounded"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};

const Hero = () => (
  <motion.section
    id="hero"
    className="flex flex-col items-center justify-center text-center flex-grow mt-16 px-6"
    style={{ minHeight: "calc(100vh - 64px)" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.9 }}
  >
    <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6 text-teal-400 max-w-4xl">
      Hello, I'm Brian Njuguna
    </h2>
    <p className="text-lg sm:text-xl max-w-3xl mb-10 leading-relaxed text-gray-400">
      Software engineer passionate about backend development, cybersecurity, and building secure,
      scalable systems.
    </p>
    <a
      href="#projects"
      className="inline-block bg-teal-500 hover:bg-teal-600 transition px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
    >
      Explore My Projects
    </a>
    <p className="mt-10 max-w-3xl text-base sm:text-lg leading-relaxed text-gray-400">
      Currently diving deep into the ALX backend program while enhancing my skills in cybersecurity
      and open-source contributions.
    </p>
  </motion.section>
);

const About = () => (
  <motion.section
    id="about"
    className="bg-[#112240] py-20 px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 text-center mb-14">About Me</h2>
      <div className="grid md:grid-cols-3 gap-12 text-center">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Backend Engineer</h3>
          <p className="text-gray-400 leading-relaxed">
            Passionate about building secure and scalable backend systems.
          </p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Cybersecurity Enthusiast</h3>
          <p className="text-gray-400 leading-relaxed">
            Constantly improving knowledge on security best practices and open-source tools.
          </p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">Open Source Contributor</h3>
          <p className="text-gray-400 leading-relaxed">
            Contributing to Linux and security projects to give back to the community.
          </p>
        </div>
      </div>
      <div className="text-center mt-12">
        <a
          href="https://docs.google.com/document/d/1AzpAenefivF0MeBmlpGmeKgM94KQJhirmFFajVDQzu8/edit?usp=sharing"
          className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-12 py-4 rounded-full font-semibold transition focus:outline-none focus:ring-2 focus:ring-teal-400"
          target="_blank"
          rel="noopener noreferrer"
        >
          View My CV
        </a>
      </div>
    </div>
  </motion.section>
);

const Projects = () => (
  <motion.section
    id="projects"
    className="py-20 px-6 max-w-7xl mx-auto"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.3 }}
  >
    <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 text-center mb-16">Featured Projects</h2>
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

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Sending...");
    setTimeout(() => {
      setStatus("Message sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 5000);
    }, 1000);
  };

  return (
    <motion.section
      id="contact"
      className="bg-[#112240] py-20 px-6 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <form
        onSubmit={handleSubmit}
        className="max-w-xl w-full flex flex-col space-y-6"
        aria-label="Contact form"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 text-center mb-8">Get in Touch</h2>
        <input
          type="text"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-4 rounded-md bg-[#0F172A] border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-300"
          aria-label="Your Name"
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-4 rounded-md bg-[#0F172A] border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-300"
          aria-label="Your Email"
        />
        <textarea
          placeholder="Your Message"
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="p-4 rounded-md bg-[#0F172A] border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 text-gray-300 resize-none"
          rows={6}
          aria-label="Your Message"
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 transition rounded-md py-4 font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Send Message
        </button>
        {status && <p className="text-center text-teal-400 mt-2">{status}</p>}
      </form>
    </motion.section>
  );
};

const SocialLinks = () => (
  <section className="fixed left-0 top-1/3 flex flex-col space-y-6 ml-4 z-30">
    {socialLinks.map(({ platform, url, icon }) => (
      <a
        key={platform}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={platform}
        className="text-teal-400 hover:text-teal-500 transition"
      >
        {icon}
      </a>
    ))}
  </section>
);

const Footer = () => (
  <footer className="py-6 text-center text-gray-500 bg-[#0F172A] border-t border-teal-700 select-none">
    &copy; {new Date().getFullYear()} Brian Njuguna. All rights reserved.
  </footer>
);

export default function App() {
  return (
    <div className="bg-[#0F172A] min-h-screen text-gray-300 flex flex-col overflow-x-hidden max-w-full">
      <Header />
      <main className="flex-grow">
        <Hero />
        <About />
        <Projects />
        <Contact />
        <SocialLinks />
      </main>
      <Footer />
    </div>
  );
}
