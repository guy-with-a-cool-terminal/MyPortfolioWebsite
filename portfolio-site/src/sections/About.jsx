import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

// Narrative terminal commands
const commands = [
  {
    cmdText: "boot brianOS...",
    output: "> Initializing personality modules...",
  },
  {
    cmdText: "cat about.txt",
    output:
      "> I'm Brian Njuguna — a backend engineer, cybersecurity enthusiast, and open source contributor. I build secure, scalable systems that don't just function — they endure.",
  },
  {
    cmdText: "cat philosophy.txt",
    output:
      "> Security isn't a feature. It's the foundation.\n> Speed matters, but resilience lasts longer.\n> Open source isn't a trend — it's a trust contract.",
  },
  {
    cmdText: "cat mission.txt",
    output:
      "> To engineer robust systems.\n> To contribute to open-source tools that empower.\n> To educate and inspire through community-driven innovation.",
  },
  {
    cmdText: "cat services.txt",
    output: [
      "🔐 Secure API & backend architecture",
      "🧠 System design & scalability consulting",
      "🛡️ Security reviews & threat modeling",
      "⚙️ CLI tools & dev automation workflows",
    ],
  },
  {
    cmdText: "cat skills.txt",
    output: [
      "Node.js",
      "Python",
      "Shell Scripting",
      "Express",
      "PostgreSQL",
      "MongoDB",
      "Linux",
      "Git & GitHub",
      "Cybersecurity Practices",
    ],
  },
  {
    cmdText: "cat final_thoughts.txt",
    output:
      "> If you're building for scale, for trust, or for something bigger than yourself...\n> Let's talk.",
  },
];

// Typing effect
const TypingCommand = ({ command, onComplete, paused }) => {
  const [typed, setTyped] = useState("");
  const idx = useRef(0);
  const cursorVisible = useRef(true);

  useEffect(() => {
    const blink = setInterval(() => {
      cursorVisible.current = !cursorVisible.current;
      setTyped((t) => t); // re-render
    }, 500);
    return () => clearInterval(blink);
  }, []);

  useEffect(() => {
    if (paused) return;
    const typer = setInterval(() => {
      if (idx.current < command.length) {
        setTyped((t) => t + command[idx.current]);
        idx.current++;
      } else {
        clearInterval(typer);
        setTimeout(onComplete, 400);
      }
    }, 45);
    return () => clearInterval(typer);
  }, [command, onComplete, paused]);

  return (
    <p className="text-green-300 font-mono text-sm sm:text-base">
      <span className="text-teal-400">brian@bastion:~$</span> {typed}
      <span className="inline-block ml-1">
        {cursorVisible.current ? "|" : "\u00A0"}
      </span>
    </p>
  );
};

const About = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef();

  const next = () => setCurrent((c) => Math.min(c + 1, commands.length));
  const skipAll = () => setCurrent(commands.length);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setPaused(!entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      className="bg-[#0f172a] text-white min-h-screen py-20 px-6 font-mono"
    >
      <div
        ref={containerRef}
        className="max-w-4xl mx-auto bg-[#0c1a2c] rounded-md overflow-hidden shadow-lg border border-teal-600"
      >
        {/* Terminal header */}
        <div className="flex space-x-2 items-center bg-[#071526] py-2 px-3">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="ml-2 text-gray-400 text-sm">brian@bastion:~</span>
        </div>

        {/* Terminal body */}
        <div className="p-6 space-y-4">
          <h2 className="text-teal-400 text-2xl sm:text-3xl font-bold">
            🖥️ Terminal — Accessing Brian Njuguna
          </h2>

          {commands.slice(0, current + 1).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              {i === current ? (
                <TypingCommand
                  command={line.cmdText}
                  onComplete={next}
                  paused={paused}
                />
              ) : (
                <>
                  <p className="text-green-300 font-mono text-sm sm:text-base">
                    <span className="text-teal-400">brian@bastion:~$</span>{" "}
                    {line.cmdText}
                  </p>
                  <motion.div
                    className="text-gray-300 font-mono mt-2 pl-4 whitespace-pre-line"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {Array.isArray(line.output) ? (
                      <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-1 pl-2 text-teal-300 text-sm">
                        {line.output.map((o, idx) => (
                          <li
                            key={idx}
                            className="bg-[#11243a] px-3 py-1 rounded-md"
                          >
                            {o}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p>{line.output}</p>
                    )}
                  </motion.div>
                </>
              )}
            </motion.div>
          ))}

          {/* Progress & Controls */}
          <div className="flex justify-between items-center pt-4">
            {current < commands.length && (
              <button
                onClick={next}
                className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-full font-mono text-sm transition"
              >
                Run Next Command →
              </button>
            )}
            {current < commands.length && (
              <button
                onClick={skipAll}
                className="text-xs text-gray-400 hover:text-teal-300 transition ml-4"
              >
                Skip All
              </button>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {current + 1}/{commands.length} commands run
            </p>
          </div>

          {/* Final CTA */}
          {current === commands.length && (
            <motion.div
              className="text-center pt-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <a
                href="https://docs.google.com/document/d/1AzpAenefivF0MeBmlpGmeKgM94KQJhirmFFajVDQzu8/edit?usp=sharing"
                className="inline-block bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-full font-semibold transition shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                target="_blank"
                rel="noopener noreferrer"
              >
                View My CV 📄
              </a>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default About;
