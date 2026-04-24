import { useEffect, useState } from "react";
import { Github, Linkedin, Facebook, Mail, ArrowRight, Sparkles } from "lucide-react";
import portrait from "@/assets/atik-portrait.jpg";

const ROLES = ["App Developer", "Software Engineer"];

export const Hero = () => {
  const [text, setText] = useState("");
  const [roleIdx, setRoleIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = ROLES[roleIdx];
    const speed = deleting ? 55 : 95;
    const timeout = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1400);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next === "") {
          setDeleting(false);
          setRoleIdx((i) => (i + 1) % ROLES.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, roleIdx]);

  return (
    <section id="home" className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background grid + blobs */}
      <div className="absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="blob h-[420px] w-[420px] bg-primary/40 -top-20 -left-10 animate-blob-move" aria-hidden="true" />
      <div className="blob h-[380px] w-[380px] bg-accent/30 bottom-0 right-0 animate-blob-move" style={{ animationDelay: "5s" }} aria-hidden="true" />

      <div className="container relative z-10 grid lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-8 items-center">
        {/* Left */}
        <div className="space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Available for freelance · Bangladesh
          </div>

          <div className="space-y-4">
            <p className="font-mono text-sm text-accent">{"// Hello, world. I'm —"}</p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold leading-[0.95]">
              Atik <span className="text-gradient">Hasan</span>
            </h1>
            <div className="flex items-center gap-2 text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-foreground/90 min-h-[2.5rem]">
              <span className="text-muted-foreground">I'm a</span>
              <span className="bg-gradient-text bg-clip-text text-transparent">{text}</span>
              <span className="inline-block h-7 sm:h-8 lg:h-10 w-[3px] bg-accent animate-blink" aria-hidden="true" />
            </div>
          </div>

          <p className="max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Building apps that solve real problems — from idea to App Store. I craft fast,
            beautiful mobile experiences with Flutter & Android, backed by clean code and
            thoughtful design.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-3.5 font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:scale-105"
            >
              Hire Me
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full border border-border glass px-7 py-3.5 font-semibold text-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              View Work
            </a>
          </div>

          <div className="flex items-center gap-3 pt-2">
            {[
              { href: "https://github.com/atikhasan2042", Icon: Github, label: "GitHub" },
              { href: "https://www.linkedin.com/in/atik-hasan-b51516331/", Icon: Linkedin, label: "LinkedIn" },
              { href: "https://www.facebook.com/atik.hasan.510156", Icon: Facebook, label: "Facebook" },
              { href: "mailto:atikhasan.io2042@gmail.com", Icon: Mail, label: "Email" },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="group flex h-11 w-11 items-center justify-center rounded-full glass text-muted-foreground transition-all hover:text-accent hover:border-accent/60 hover:-translate-y-1"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Right - portrait */}
        <div className="relative flex items-center justify-center animate-fade-in animation-delay-300">
          <div className="relative">
            {/* Outer rotating ring */}
            <div className="absolute -inset-8 rounded-full border border-primary/30 animate-spin-slow" />
            <div className="absolute -inset-12 rounded-full border border-accent/20 animate-spin-slow" style={{ animationDirection: "reverse", animationDuration: "32s" }} />

            {/* Glowing photo container */}
            <div className="relative h-72 w-72 sm:h-80 sm:w-80 lg:h-[420px] lg:w-[420px] rounded-full p-[3px] bg-gradient-primary animate-pulse-glow">
              <div className="h-full w-full rounded-full overflow-hidden bg-surface animate-float">
                <img
                  src={portrait}
                  alt="Portrait of Atik Hasan, app developer"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>

            {/* Floating tech badges */}
            {[
              { label: "Flutter", className: "top-2 -left-4 sm:-left-8", delay: "0s" },
              { label: "Dart", className: "top-1/2 -right-6 sm:-right-10", delay: "1.5s" },
              { label: "Firebase", className: "-bottom-2 left-6 sm:left-10", delay: "3s" },
              { label: "Java", className: "-top-4 right-8 sm:right-12", delay: "0.7s" },
            ].map((b) => (
              <div
                key={b.label}
                className={`absolute ${b.className} glass rounded-full px-3 py-1.5 text-xs font-mono text-foreground shadow-card animate-float-slow`}
                style={{ animationDelay: b.delay }}
              >
                {b.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
