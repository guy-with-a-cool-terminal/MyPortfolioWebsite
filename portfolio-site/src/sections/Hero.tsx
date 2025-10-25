import { motion } from "framer-motion";

const Hero = () => (
  <motion.section
    id="hero"
    className="relative flex flex-col items-center justify-center text-center flex-grow mt-16 px-6 overflow-hidden"
    style={{ minHeight: "calc(100vh - 64px)" }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.9 }}
  >
    {/* Background glow effect */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-glow opacity-20 blur-3xl" />
    </div>

    <motion.h2
      className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      Hello, I'm{" "}
      <span className="gradient-text glow-text">Brian Njuguna</span>
    </motion.h2>

    <motion.p
      className="text-lg sm:text-xl lg:text-2xl max-w-3xl mb-10 leading-relaxed text-muted-foreground"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      Fullstack developer focusing on{" "}
      <span className="text-primary font-semibold">backend systems, APIs</span> and{" "}
      <span className="text-primary font-semibold">DevOps</span>. I simplify technical complexity by building tools that make developers' work easier and systems that non-technical users understand.
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-col sm:flex-row gap-4 mb-12"
    >
      <a
        href="#projects"
        className="group inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-lg bg-primary text-primary-foreground shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary active:scale-95"
      >
        <span>Explore My Projects</span>
        <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </a>
      
      <a
        href="#contact"
        className="inline-flex items-center justify-center px-8 sm:px-10 py-3 sm:py-4 rounded-full font-semibold text-lg border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary active:scale-95"
      >
        Get in Touch
      </a>
    </motion.div>

    {/* Decorative elements */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary/50"
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  </motion.section>
);

export default Hero;
