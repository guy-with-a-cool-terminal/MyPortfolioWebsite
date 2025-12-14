import React from "react";
import socialLinks from "../data/socialLinks";

const SocialSidebar = () => (
  <nav
    aria-label="Social media links"
    className="fixed bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-50 md:left-0 md:top-1/3 md:translate-x-0 md:translate-y-0 md:flex-col md:space-x-0 md:space-y-4"
  >
    {socialLinks.map(({ platform, url, Icon }, idx) => {
      return (
        <a
          key={platform}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={platform}
          className="group relative text-muted-foreground hover:text-primary transition-all duration-300 p-2 rounded-lg hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary hover:scale-110 active:scale-95"
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          {Icon && (
            typeof Icon === 'string' ? (
              // Image icon (WhatsApp SVG)
              <img 
                src={Icon} 
                alt={`${platform} icon`}
                className="w-6 h-6 transform group-hover:rotate-12 transition-all duration-300 opacity-70 group-hover:opacity-100 group-hover:scale-110"
              />
            ) : (
              // Lucide component icon
              <Icon className="w-6 h-6 transform group-hover:rotate-12 transition-all duration-300" />
            )
          )}
          <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-card border border-border rounded-lg text-sm font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-300 shadow-lg md:bottom-auto md:left-full md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:ml-2 md:mb-0 md:group-hover:translate-x-1 md:group-hover:translate-y-0">
            {platform}
          </span>
        </a>
      );
    })}
  </nav>
);

export default SocialSidebar;