import { Github, Linkedin, Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-white/5 bg-black/20 backdrop-blur-lg mt-20">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col items-center text-center gap-6">

        {/* Brand */}
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-2xl font-bold text-white tracking-tight">Brian Njuguna</h3>
          <p className="text-sm text-gray-400">Engineering Scalable Digital Infrastructure.</p>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-6 mt-2">
          <a href="https://github.com/guy-with-a-cool-terminal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <Github className="w-5 h-5" />
          </a>
          <a href="mailto:hello@brian.cnbcode.com" className="text-gray-400 hover:text-white transition-colors">
            <Mail className="w-5 h-5" />
          </a>
          <a href="https://cnbcode.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-500 font-mono mt-8">
          © {new Date().getFullYear()} Brian Njuguna. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;