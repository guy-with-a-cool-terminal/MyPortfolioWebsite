import { motion } from "framer-motion";

const About = () => (
  <motion.section
    id="about"
    className="bg-[#112240] py-20 px-6"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1 }}
  >
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl sm:text-4xl font-bold text-teal-400 text-center mb-14">
        About Me
      </h2>
      <div className="grid md:grid-cols-3 gap-12 text-center">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
            Backend Engineer
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Passionate about building secure and scalable backend systems.
          </p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
            Cybersecurity Enthusiast
          </h3>
          <p className="text-gray-400 leading-relaxed">
            Constantly improving knowledge on security best practices and open-source tools.
          </p>
        </div>
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold mb-4 text-white">
            Open Source Contributor
          </h3>
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

export default About;
