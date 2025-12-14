import { Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => (
  <footer className="glass border-t border-border py-16 mt-20">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img src="/favicon.svg" alt="Brian Njuguna Logo" className="w-10 h-10" />
            <div>
              <h3 className="text-xl font-bold text-foreground">Brian Njuguna</h3>
              <p className="text-sm text-muted-foreground">Fullstack Developer</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            Building production systems and payment infrastructure with Python, React, and TypeScript.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Contact</h4>
          <div className="space-y-3">
            <a 
              href="mailto:hello@brian.cnbcode.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              <Mail className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
              <span className="break-all">hello@brian.cnbcode.com</span>
            </a>
            <a 
              href="tel:+254114399034"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              <Phone className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
              +254 114 399 034
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Links</h4>
          <div className="space-y-3">
            <a 
              href="https://cnbcode.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              CnB Code
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a 
              href="https://github.com/guy-with-a-cool-terminal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors duration-300 group"
            >
              GitHub
              <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} <span className="text-primary font-semibold">Brian Njuguna</span>. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground/60 font-mono">
          Built with React, TypeScript & Tailwind CSS
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;