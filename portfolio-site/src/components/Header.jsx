import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import NavLinks from "./NavLinks";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuStatus, setMenuStatus] = useState("");

  const toggleMenu = () => {
    setIsOpen((prev) => {
      const newState = !prev;
      setMenuStatus(newState ? "Menu opened" : "Menu closed");
      return newState;
    });
  };

  return (
    <>
      <a
        href="#maincontent"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-500 text-white px-4 py-2 rounded z-50"
      >
        Skip to main content
      </a>

      <header
        className="fixed top-0 left-0 w-full bg-[#0F172A] backdrop-blur-md border-b border-teal-700 z-40"
        role="banner"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-2xl font-bold text-teal-400 cursor-default select-none"
            tabIndex={-1}
          >
            Brian Njuguna
          </h1>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex space-x-8 text-lg font-medium"
          >
            <NavLinks />
          </nav>

          <button
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            onClick={toggleMenu}
            className="md:hidden text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded p-1"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div role="status" aria-live="polite" className="sr-only" aria-atomic="true">
          {menuStatus}
        </div>

        <nav
          id="mobile-menu"
          className={`md:hidden bg-[#0F172A] border-t border-teal-700 overflow-hidden w-full max-w-full transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-48" : "max-h-0"
          }`}
          aria-label="Mobile Primary navigation"
        >
          <div className="flex flex-col px-6 py-4 space-y-4 text-lg font-medium w-full max-w-full">
            <NavLinks onClick={() => setIsOpen(false)} />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
