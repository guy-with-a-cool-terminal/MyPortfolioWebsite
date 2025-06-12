import React from "react";
import socialLinks from "../data/socialLinks";

const SocialSidebar = () => (
  <nav
    aria-label="Social media links"
    className="fixed top-1/3 left-0 flex flex-col space-y-6 bg-[#0F172A] py-4 px-2 rounded-r-md shadow-lg z-50"
  >
    {socialLinks.map(({ platform, url, Icon }) => (
      <a
        key={platform}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={platform}
        className="text-teal-400 hover:text-teal-500 transition p-2 rounded focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-[#0F172A]"
      >
        <Icon className="w-6 h-6" />
      </a>
    ))}
  </nav>
);

export default SocialSidebar;
