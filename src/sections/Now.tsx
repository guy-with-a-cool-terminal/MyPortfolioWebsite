import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const Now = () => {
  return (
    <section className="bg-gradient-subtle py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block px-4 py-1.5 rounded-full text-sm bg-secondary/10 text-secondary border border-secondary/30 mb-4">
            Current Focus
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            What I'm <span className="text-secondary">Building</span>
          </h2>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <motion.div
            className="glass p-8 rounded-xl border border-border/50 hover:border-secondary/40 transition-all duration-500 group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            style={{ boxShadow: 'var(--shadow-md)' }}
          >
            <div className="mb-4">
              <span className="text-2xl font-bold text-foreground/70 group-hover:text-foreground transition-all duration-300" style={{ textShadow: '0 0 15px rgba(var(--secondary-rgb), 0.3)' }}>
                CnB Code
              </span>
            </div>
            
            <p className="text-muted-foreground text-base leading-relaxed mb-4">
              Running a development agency focused on making business operations run smoother. We integrate AI into business systems, automate workflows that waste time, and build the digital infrastructure that drives real results—whether that's 5 new customers daily or streamlined operations. Leading client projects and managing developer teams to ship solutions that matter.
            </p>

            <a
              href="https://cnbcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors duration-300 font-medium group"
            >
              Visit CNB Code
              <ExternalLink className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Now;