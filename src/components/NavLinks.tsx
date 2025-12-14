import React from "react";

interface NavLinksProps {
  onClick?: () => void;
}

const NavLinks = ({ onClick }: NavLinksProps = {}) => (
  <>
    {["about", "projects", "contact"].map((id) => (
      <a
        key={id}
        href={`#${id}`}
        onClick={onClick}
        className="relative text-foreground hover:text-primary transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary rounded px-2 py-1 group"
      >
        <span className="relative z-10">{id.charAt(0).toUpperCase() + id.slice(1)}</span>
        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
      </a>
    ))}
  </>
);

export default NavLinks;
