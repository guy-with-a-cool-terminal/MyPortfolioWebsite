import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SocialSidebar from "./components/SocialSidebar";
import EasterEgg from "./components/EasterEgg";
import ScrollProgress from "./components/ScrollProgress";
import Footer from "./components/Footer";
import Hero from "./sections/Hero";
import Projects from "./sections/Projects";
import Skills from "./sections/Skills";
import About from "./sections/About";
import Contact from "./sections/Contact";
import Progress from "./sections/Progress";


const MainLayout = () => (
  <>
    <ScrollProgress />
    <Header />
    <SocialSidebar />
    <EasterEgg />
    <Hero />
    <About />
    <Projects />
    <Skills />
    <Contact />
    <Footer />
  </>
);

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainLayout />} />
      <Route path="/progress" element={<Progress />} />
    </Routes>
  </BrowserRouter>
);

// const App = () => (
//   <div className="bg-background text-foreground min-h-screen flex flex-col">
//     <Header />
//     <SocialSidebar />
//     <EasterEgg />
//     <main id="maincontent" className="flex-grow">
//       <Hero />
//       <Projects />
//       <Skills />
//       <About />
//       <Now />
//       <Contact />
//     </main>
//     <Footer />
//   </div>
// );

export default App;
