import React from "react";
import Header from "./components/Header";
import SocialSidebar from "./components/SocialSidebar";
import EasterEgg from "./components/EasterEgg";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import About from "./sections/About";
import Now from "./sections/Now";
import Contact from "./sections/Contact";

const App = () => (
  <div className="bg-background text-foreground min-h-screen flex flex-col">
    <Header />
    <SocialSidebar />
    <EasterEgg />
    <main id="maincontent" className="flex-grow">
      <Hero />
      <Projects />
      <Skills />
      <About />
      <Now />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default App;
