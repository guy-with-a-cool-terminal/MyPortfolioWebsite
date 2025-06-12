import React from "react";
import Header from "./components/Header";
import SocialSidebar from "./components/SocialSidebar";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

const App = () => (
  <div className="bg-[#071422] text-white min-h-screen flex flex-col">
    <Header />
    <SocialSidebar />
    <main id="maincontent" className="flex-grow">
      <Hero />
      <About />
      <Projects />
      <Contact />
    </main>
    <Footer />
  </div>
);

export default App;
