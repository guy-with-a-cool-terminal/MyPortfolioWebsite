import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setStatus("Sending...");
      setTimeout(() => {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      }, 1000);
    },
    []
  );

  return (
    <motion.section
      id="contact"
      className="relative py-8 sm:py-12 px-4 sm:px-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6 sm:mb-8">
          <motion.span
            className="inline-block px-4 py-1.5 rounded-full text-sm font-mono bg-primary/10 text-primary border border-primary/20 mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            &lt;contact /&gt;
          </motion.span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold gradient-text mb-2">
            Let's Work Together
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Have a project in mind? Send me a message below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col space-y-4 glass p-5 sm:p-6 rounded-xl"
          aria-label="Contact form"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-300 hover:border-primary/30"
              aria-label="Your Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground transition-all duration-300 hover:border-primary/30"
              aria-label="Your Email"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Message
            </label>
            <textarea
              id="message"
              placeholder="Tell me about your project..."
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground resize-none transition-all duration-300 hover:border-primary/30"
              aria-label="Your Message"
            />
          </div>

          <button
            type="submit"
            className="group relative w-full py-3 rounded-lg font-semibold text-base bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden flex items-center justify-center gap-2 active:scale-95"
          >
            <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="relative z-10">Send Message</span>
          </button>

          {status && (
            <motion.p
              role="alert"
              className="text-center text-sm text-primary font-semibold p-3 rounded-lg bg-primary/10 border border-primary/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {status}
            </motion.p>
          )}
        </form>
      </div>
    </motion.section>
  );
};

export default Contact;
