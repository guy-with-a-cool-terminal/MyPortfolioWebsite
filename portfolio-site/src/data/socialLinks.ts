import { Github, Linkedin, LucideIcon } from "lucide-react";

interface SocialLink {
  platform: string;
  url: string;
  Icon?: LucideIcon | React.ComponentType<{ className?: string }>;
}

const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/guy-with-a-cool-terminal",
    Icon: Github,
  },
  {
    platform: "LinkedIn",
    url: "https://www.linkedin.com/in/briannjuguuna",
    Icon: Linkedin,
  },
  {
    platform: "WhatsApp",
    url: "https://wa.me/254114399034?text=Hi%20Brian%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you.",
  },
];

export default socialLinks;
