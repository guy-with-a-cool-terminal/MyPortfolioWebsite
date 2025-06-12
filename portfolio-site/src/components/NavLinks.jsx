import React from "react";

const NavLinks = ({ onClick }) => (
  <>
    {["about", "projects", "contact"].map((id) => (
      <a
        key={id}
        href={`#${id}`}
        onClick={onClick}
        className="hover:text-teal-400 transition focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A] rounded"
      >
        {id.charAt(0).toUpperCase() + id.slice(1)}
      </a>
    ))}
  </>
);

export default NavLinks;
