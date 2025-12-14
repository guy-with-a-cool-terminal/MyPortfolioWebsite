import React, { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

interface FormState {
  name: string;
  email: string;
  message: string;
}

const Contact = () => {
  const [form, setForm] = useState<FormState>({ name: "", email: "", message: "" });
  const [error, setError] = useState<string | null>(null);

  const handleSend = () => {
    // Validate fields
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all fields");
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Format the WhatsApp message
    const whatsappMessage = `Hi Brian! 👋

*Name:* ${form.name}
*Email:* ${form.email}

*Message:*
${form.message}`;

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(whatsappMessage);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/254114399034?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Clear form after sending
    setForm({ name: "", email: "", message: "" });
  };

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
            Have a project in mind? Fill the form and I'll reach out on WhatsApp.
          </p>
        </div>

        <div
          className="flex flex-col space-y-4 glass p-5 sm:p-6 rounded-xl"
          role="form"
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
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
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
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-foreground placeholder:text-muted-foreground resize-none transition-all duration-300 hover:border-primary/30"
              aria-label="Your Message"
            />
          </div>

          <button
            onClick={handleSend}
            className="group relative w-full py-3 rounded-lg font-semibold text-base bg-primary text-primary-foreground transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/20 focus:outline-none focus:ring-2 focus:ring-primary overflow-hidden flex items-center justify-center gap-2 active:scale-95"
          >
            <Send className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            <span className="relative z-10">Send via WhatsApp</span>
          </button>

          {error && (
            <motion.p
              role="alert"
              className="text-center text-sm text-red-500 font-semibold p-3 rounded-lg bg-red-500/10 border border-red-500/20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.p>
          )}

          <p className="text-center text-xs text-muted-foreground">
            This will open WhatsApp with your message pre-filled
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Contact;