import { useEffect, useState } from "react";
import { ExternalLink, Github, Star, X, ChevronLeft, ChevronRight } from "lucide-react";
import tpHome from "@/assets/tour-partner-home.jpeg";
import tpProfile from "@/assets/tour-partner-profile.jpeg";
import tpSettings from "@/assets/tour-partner-settings.jpeg";
import tpAbout from "@/assets/tour-partner-about.jpeg";
import haOne from "@/assets/projects/health-assistant-1.jpg";
import haTwo from "@/assets/projects/health-assistant-2.jpg";
import ibwOne from "@/assets/projects/ibw-calculator-1.jpg";
import ibwTwo from "@/assets/projects/ibw-calculator-2.jpg";
import loginOne from "@/assets/projects/login-1.jpg";
import loginTwo from "@/assets/projects/login-2.jpg";
import bmiOne from "@/assets/projects/bmi-1.jpg";
import bmiTwo from "@/assets/projects/bmi-2.jpg";

type DemoScreen = { src: string; label: string };

type Project = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  featured?: boolean;
  accent: string;
  initials: string;
  heroImage: string;
  screens: DemoScreen[];
};

const projects: Project[] = [
  {
    id: "tour-partner",
    name: "Tour Partner",
    description:
      "Your all-in-one travel companion — discover destinations, plan itineraries, track expenses and share trips with friends. Built with Flutter & Firebase for a buttery-smooth offline-first experience.",
    tags: ["Flutter", "Firebase", "Maps API", "Provider"],
    featured: true,
    accent: "from-sky-400 via-blue-500 to-cyan-400",
    initials: "TP",
    heroImage: tpHome,
    screens: [
      { src: tpProfile, label: "Profile Settings" },
      { src: tpSettings, label: "App Settings" },
      { src: tpAbout, label: "About" },
    ],
  },
  {
    id: "health-assistant",
    name: "Health Assistant",
    description:
      "A wellness companion app with quick access to doctors, blood banks, health tips, BMI & IBW calculators and balanced-diet guides — designed for fast, distraction-free everyday use.",
    tags: ["Flutter", "Dart", "Material UI"],
    accent: "from-emerald-400 via-green-500 to-teal-500",
    initials: "HA",
    heroImage: haOne,
    screens: [
      { src: haOne, label: "Home Dashboard" },
      { src: haTwo, label: "Find Doctor" },
    ],
  },
  {
    id: "ibw-calculator",
    name: "IBW Calculator",
    description:
      "Calculate your Ideal Body Weight in seconds — pick gender, enter height in feet & inches and get an instant result with a personalised pro tip to keep you on track.",
    tags: ["Flutter", "Health", "Forms"],
    accent: "from-teal-400 via-emerald-500 to-cyan-500",
    initials: "IBW",
    heroImage: ibwOne,
    screens: [
      { src: ibwOne, label: "Input Form" },
      { src: ibwTwo, label: "Result View" },
    ],
  },
  {
    id: "auth-ui",
    name: "Sign Up / Login UI",
    description:
      "A clean, modern authentication flow with create-account and welcome-back screens — vibrant cyan gradients, friendly icons and accessible form fields ready to plug into any Flutter app.",
    tags: ["Flutter", "UI Kit", "Auth"],
    accent: "from-cyan-400 via-sky-500 to-blue-500",
    initials: "AU",
    heroImage: loginOne,
    screens: [
      { src: loginOne, label: "Create Account" },
      { src: loginTwo, label: "Welcome Back" },
    ],
  },
  {
    id: "bmi-calculator",
    name: "BMI Calculator",
    description:
      "Track your Body Mass Index with a smooth slider-based input for height and weight, then get an instant category result with a friendly, supportive recommendation.",
    tags: ["Flutter", "Health", "Sliders"],
    accent: "from-emerald-400 via-teal-500 to-green-500",
    initials: "BMI",
    heroImage: bmiOne,
    screens: [
      { src: bmiOne, label: "Input Sliders" },
      { src: bmiTwo, label: "Result View" },
    ],
  },
];

const PhoneMockup = ({
  accent,
  initials,
  image,
  alt,
}: {
  accent: string;
  initials: string;
  image?: string;
  alt?: string;
}) => (
  <div className="relative mx-auto h-[360px] w-[180px] sm:h-[400px] sm:w-[200px] rounded-[2.4rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-elevated">
    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-background z-10" />
    {image ? (
      <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-background">
        <img
          src={image}
          alt={alt ?? "App preview"}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    ) : (
      <div className={`relative h-full w-full overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${accent} flex flex-col items-center justify-center text-foreground`}>
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="relative font-display text-6xl font-bold text-white drop-shadow-lg">{initials}</div>
        <p className="relative mt-3 font-mono text-xs text-white/90 tracking-widest">EXPLORE · PLAN · GO</p>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-1.5 rounded-full bg-white ${i === 0 ? "w-6" : "w-1.5 opacity-60"}`} />
          ))}
        </div>
      </div>
    )}
  </div>
);

const DemoLightbox = ({
  open,
  onClose,
  screens,
  projectName,
}: {
  open: boolean;
  onClose: () => void;
  screens: DemoScreen[];
  projectName: string;
}) => {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (open) setIdx(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % screens.length);
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + screens.length) % screens.length);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, screens.length]);

  if (!open) return null;

  const next = () => setIdx((i) => (i + 1) % screens.length);
  const prev = () => setIdx((i) => (i - 1 + screens.length) % screens.length);
  const current = screens[idx];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${projectName} demo screens`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close demo"
        className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:text-accent hover:border-accent transition-colors"
      >
        <X className="h-5 w-5" />
      </button>

      {screens.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous screen"
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:text-accent hover:border-accent transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next screen"
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full glass text-foreground hover:text-accent hover:border-accent transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        className="relative flex flex-col items-center gap-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-[70vh] max-h-[640px] aspect-[9/19.5] rounded-[2.4rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-elevated overflow-hidden">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-background z-10" />
          <img
            src={current.src}
            alt={`${projectName} — ${current.label}`}
            className="h-full w-full object-cover rounded-[1.6rem]"
          />
        </div>

        <div className="flex items-center gap-3">
          <p className="font-display font-semibold text-foreground">{current.label}</p>
          <span className="font-mono text-xs text-muted-foreground">
            {idx + 1} / {screens.length}
          </span>
        </div>

        <div className="flex gap-2">
          {screens.map((s, i) => (
            <button
              key={s.label}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`Go to ${s.label}`}
              className={`h-2 rounded-full transition-all ${i === idx ? "w-8 bg-gradient-primary" : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectShowcase = ({
  project,
  reverse,
  onOpenDemo,
}: {
  project: Project;
  reverse?: boolean;
  onOpenDemo: () => void;
}) => (
  <div className="relative group">
    {project.featured && (
      <div className="absolute -inset-px rounded-[2rem] bg-gradient-primary opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse-glow" />
    )}
    <div className="relative glass rounded-[2rem] p-8 sm:p-12 overflow-hidden border-accent/50">
      {project.featured && (
        <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-glow-primary">
          <Star className="h-3 w-3 fill-current" /> FEATURED
        </div>
      )}

      <div className={`grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center ${reverse ? "lg:[&>*:first-child]:order-2" : ""}`}>
        <div>
          <p className="font-mono text-xs text-accent mb-3">
            {project.featured ? "Flagship Project" : "Project Showcase"}
          </p>
          <h3 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            <span className="text-gradient">{project.name}</span>
          </h3>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-7">
            {project.tags.map((t) => (
              <span key={t} className="rounded-full bg-accent/10 border border-accent/30 px-3 py-1 font-mono text-xs text-accent">
                {t}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:scale-105"
            >
              <ExternalLink className="h-4 w-4" /> View Demo
            </button>
            <a
              href="https://github.com/atikhasan2042"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 font-semibold text-foreground hover:border-accent/60 hover:text-accent transition-colors"
            >
              <Github className="h-4 w-4" /> Source
            </a>
          </div>
        </div>

        <div className="flex justify-center animate-float">
          <PhoneMockup
            accent={project.accent}
            initials={project.initials}
            image={project.heroImage}
            alt={`${project.name} preview`}
          />
        </div>
      </div>
    </div>
  </div>
);

export const Projects = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = projects.find((p) => p.id === activeId) ?? null;

  return (
    <section id="projects" className="relative py-28 sm:py-32">
      <div className="container relative z-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A handful of apps I've designed, built and shipped end-to-end.
          </p>
        </div>

        <div className="space-y-12">
          {projects.map((p, i) => (
            <ProjectShowcase
              key={p.id}
              project={p}
              reverse={i % 2 === 1}
              onOpenDemo={() => setActiveId(p.id)}
            />
          ))}
        </div>
      </div>

      <DemoLightbox
        open={!!active}
        onClose={() => setActiveId(null)}
        screens={active?.screens ?? []}
        projectName={active?.name ?? ""}
      />
    </section>
  );
};
