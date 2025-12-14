import { Github, Linkedin, LucideIcon } from "lucide-react";
import whatsappImg from '../assets/whatsapp.svg';

interface SocialLink {
  platform: string;
  url: string;
  Icon: LucideIcon | string; 
}

const socialLinks: SocialLink[] = [
  {
    platform: "GitHub",
    url: "https://github.com/guy-with-a-cool-terminal",
    Icon: Github,
  },
  {
    platform: "LinkedIn",
    url: "https://linkedin.com/in/brian-njuguna-80734b242",
    Icon: Linkedin,
  },
  {
    platform: "WhatsApp",
    url: "https://wa.me/254114399034?text=Hi%20Brian%2C%20I'd%20like%20to%20discuss%20a%20project%20with%20you.",
    Icon: whatsappImg,
  },
];

export default socialLinks;