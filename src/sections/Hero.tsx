import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const Hero = () => {
  // Official Tech & Tool Icons
  // Using original/plain SVG versions from devicon and simple-icons for brand accuracy
  const floatingIcons = [
    { name: 'Python', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg', position: 'top-10 right-[10%]', size: 'w-10 h-10', delay: 0 },
    { name: 'Django', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg', position: 'top-32 right-[25%]', size: 'w-10 h-10', delay: 1 },
    { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg', position: 'top-1/2 right-[15%]', size: 'w-14 h-14', delay: 2 },
    { name: 'TypeScript', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg', position: 'bottom-32 right-[20%]', size: 'w-8 h-8', delay: 3 },
    { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg', position: 'bottom-10 right-[10%]', size: 'w-10 h-10', delay: 4 },
    { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg', position: 'top-20 right-[35%]', size: 'w-9 h-9', delay: 1.5 },
    // Adding Stripe/Paypal/Jenkins as requested/implied
    { name: 'Jenkins', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jenkins/jenkins-original.svg', position: 'bottom-1/4 right-[30%]', size: 'w-10 h-10', delay: 2.5 },
  ];

  return (
    <motion.section
      id="hero"
      className="relative flex flex-col items-start justify-center flex-grow mt-16 px-6 lg:px-12 overflow-hidden max-w-7xl mx-auto w-full"
      style={{ minHeight: "calc(100vh - 64px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9 }}
    >
      {/* Background Elements - Subtle */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Subtle gradient blob - Blue/Cyan */}
        <motion.div
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, hsl(220 90% 56%), transparent 70%)',
            filter: 'blur(60px)'
          }}
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating Icons Area */}
      {/* Mobile: Background layer with low opacity */}
      <div className="absolute inset-0 pointer-events-none lg:hidden overflow-hidden">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={`mobile-${item.name}`}
            className="absolute opacity-10"
            style={{
              top: `${(i * 15) + 10}%`,
              right: `${(i % 2 === 0 ? 10 : 60)}%`,
            }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 4 + item.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={`${item.size} filter grayscale`}
            />
          </motion.div>
        ))}
      </div>

      {/* Desktop: Floating on the far right column to avoid text overlap */}
      <div className="absolute inset-y-0 right-0 w-1/2 pointer-events-none hidden lg:block overflow-visible">
        {floatingIcons.map((item, i) => (
          <motion.div
            key={item.name}
            className={`absolute ${item.position} opacity-90 p-4 bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -15, 0],
              x: [0, 5, 0]
            }}
            transition={{
              opacity: { duration: 0.5, delay: i * 0.1 },
              scale: { duration: 0.5, delay: i * 0.1 },
              y: {
                duration: 4 + item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              },
              x: {
                duration: 5 + item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }
            }}
          >
            <img
              src={item.icon}
              alt={item.name}
              className={`${item.size} object-contain`}
              title={item.name}
            />
          </motion.div>
        ))}
      </div>

      <div className="max-w-2xl">
        {/* Badge */}
        <motion.div
          className="inline-block mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <span className="px-4 py-2 rounded-full text-xs font-semibold bg-foreground text-background uppercase tracking-wider">
            Software Engineer
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Hi, I'm Brian.
          <br />
          <span className="text-foreground">I Engineer Scalable<br className="hidden lg:block" /> Digital Infrastructure.</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          className="text-lg sm:text-xl max-w-xl mb-6 leading-relaxed text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          I architect robust full-stack solutions that drive business growth. Specializing in high-performance Python/Django backends, payment systems, and reactive interfaces.
        </motion.p>

        {/* Location & Availability */}
        <motion.div
          className="flex items-center gap-3 mb-10 text-sm font-medium"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <div className="flex items-center gap-2 text-muted-foreground bg-secondary/10 px-3 py-1.5 rounded-full border border-secondary/20">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>Nairobi, Kenya</span>
          </div>
          <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Remote Available</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <a
            href="https://wa.me/254114399034?text=Hi%20Brian%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-base bg-primary text-primary-foreground hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary active:scale-95 shadow-lg shadow-primary/25"
          >
            Start a Project
          </a>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Hero;