import whatsappImg from "../assets/whatsapp.svg";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.section
      id="contact"
      className="relative py-20 px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.span
          className="inline-block px-4 py-1.5 rounded-full text-sm font-mono bg-primary/10 text-primary border border-primary/20 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          &lt;contact /&gt;
        </motion.span>

        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to build something?
        </h2>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
          I'm currently available for new projects. Let's discuss how we can solve your business problems with code.
        </p>

        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <a
            href="https://wa.me/254114399034"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#25D366] text-white font-bold text-lg shadow-lg shadow-[#25D366]/20 transition-all hover:shadow-[#25D366]/40 hover:bg-[#20bd5a]"
          >
            <img src={whatsappImg} alt="WhatsApp" className="w-6 h-6" />
            Chat on WhatsApp
          </a>
        </motion.div>

        <p className="mt-6 text-sm text-muted-foreground">
          Direct response. No forms, no waiting.
        </p>
      </div>
    </motion.section>
  );
};

export default Contact;