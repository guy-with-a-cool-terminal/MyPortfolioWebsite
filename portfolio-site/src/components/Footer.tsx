const Footer = () => (
  <footer className="glass border-t border-border text-center py-8 text-sm mt-20">
    <p className="text-muted-foreground">
      © {new Date().getFullYear()}{" "}
      <span className="text-primary font-semibold">Brian Njuguna</span>. All rights reserved.
    </p>
    <p className="text-muted-foreground/60 mt-2 font-mono text-xs">
      Built with ❤️ using React & Tailwind CSS
    </p>
  </footer>
);

export default Footer;
