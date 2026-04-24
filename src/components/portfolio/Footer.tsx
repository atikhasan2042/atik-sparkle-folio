import { Github, Linkedin, Facebook, Mail, Heart } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border/60 py-10 mt-16">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-6">
        <a href="#home" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground shadow-glow-primary">
            AH
          </div>
          <div>
            <p className="font-display font-bold text-foreground">Atik Hasan</p>
            <p className="text-xs text-muted-foreground">App Developer · Software Engineer</p>
          </div>
        </a>

        <div className="flex items-center gap-3">
          {[
            { Icon: Github, href: "https://github.com/atikhasan2042", label: "GitHub" },
            { Icon: Linkedin, href: "https://www.linkedin.com/in/atik-hasan-b51516331/", label: "LinkedIn" },
            { Icon: Facebook, href: "https://www.facebook.com/atik.hasan.510156", label: "Facebook" },
            { Icon: Mail, href: "mailto:atikhasan.io2042@gmail.com", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
        </div>

        <p className="text-sm text-muted-foreground inline-flex items-center gap-1.5">
          © {year} · Made with <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" /> by Atik Hasan
        </p>
      </div>
    </footer>
  );
};