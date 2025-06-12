import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setStatus("Sending...");
      setTimeout(() => {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      }, 1000);
    },
    [setStatus, setForm]
  );

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
        <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 text-center mb-8">
          Get in Touch
        </h2>
        <input
          type="text"
          placeholder="Your Name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="p-4 rounded-md bg-[#0F172A] border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] text-gray-300"
          aria-label="Your Name"
        />
        <input
          type="email"
          placeholder="Your Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="p-4 rounded-md bg-[#0F172A] border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] text-gray-300"
          aria-label="Your Email"
        />
        <textarea
          placeholder="Your Message"
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="p-4 rounded-md bg-[#0F172A] border border-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] text-gray-300 resize-none"
          aria-label="Your Message"
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 transition py-4 rounded-full font-semibold text-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A]"
        >
          Send Message
        </button>
        {status && (
          <p
            role="alert"
            className="text-center mt-4 text-teal-400 font-semibold"
          >
            {status}
          </p>
        )}
      </form>
    </motion.section>
  );
};

export default Contact;
