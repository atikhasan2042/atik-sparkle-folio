import { ExternalLink, Github, Star } from "lucide-react";

type Project = {
  name: string;
  description: string;
  tags: string[];
  featured?: boolean;
  accent: string;
  initials: string;
};

const projects: Project[] = [
  {
    name: "Tour Partner",
    description:
      "Your all-in-one travel companion — discover destinations, plan itineraries, track expenses and share trips with friends. Built with Flutter & Firebase for a buttery-smooth offline-first experience.",
    tags: ["Flutter", "Firebase", "Maps API", "Provider"],
    featured: true,
    accent: "from-sky-400 via-blue-500 to-cyan-400",
    initials: "TP",
  },
  {
    name: "TaskFlow",
    description: "A minimal, keyboard-first task manager with daily focus mode and streak tracking.",
    tags: ["Flutter", "Hive", "Riverpod"],
    accent: "from-violet-500 to-fuchsia-500",
    initials: "TF",
  },
  {
    name: "BudgetBee",
    description: "Personal finance tracker with smart category insights and monthly reports.",
    tags: ["Android", "Java", "Room DB"],
    accent: "from-amber-400 to-orange-500",
    initials: "BB",
  },
  {
    name: "Quizzy",
    description: "Realtime multiplayer quiz app with live leaderboards and custom rooms.",
    tags: ["Flutter", "Firestore", "WebSockets"],
    accent: "from-emerald-400 to-teal-500",
    initials: "QZ",
  },
];

const PhoneMockup = ({ accent, initials }: { accent: string; initials: string }) => (
  <div className="relative mx-auto h-[360px] w-[180px] sm:h-[400px] sm:w-[200px] rounded-[2.4rem] border-[10px] border-foreground/90 bg-foreground/90 shadow-elevated">
    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-background z-10" />
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
  </div>
);

const SmallCard = ({ p }: { p: Project }) => (
  <div className="group relative glass rounded-3xl p-6 transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-glow-primary overflow-hidden">
    <div className={`absolute -top-20 -right-20 h-48 w-48 rounded-full bg-gradient-to-br ${p.accent} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />

    <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${p.accent} font-display text-2xl font-bold text-white shadow-lg`}>
      {p.initials}
    </div>

    <h3 className="font-display text-2xl font-bold text-foreground mb-2">{p.name}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed mb-5">{p.description}</p>

    <div className="flex flex-wrap gap-2 mb-6">
      {p.tags.map((t) => (
        <span key={t} className="rounded-full bg-secondary/80 px-3 py-1 font-mono text-xs text-muted-foreground border border-border">
          {t}
        </span>
      ))}
    </div>

    <div className="flex items-center gap-3">
      <a href="#" className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
        <ExternalLink className="h-4 w-4" /> View Demo
      </a>
      <a href="#" aria-label="Source code" className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-accent hover:border-accent transition-colors">
        <Github className="h-4 w-4" />
      </a>
    </div>
  </div>
);

export const Projects = () => {
  const featured = projects.find((p) => p.featured)!;
  const rest = projects.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-28 sm:py-32">
      <div className="container relative z-10">
        <div className="max-w-2xl mb-14">
          <p className="font-mono text-sm text-accent mb-3">// 04 — selected work</p>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            A handful of apps I've designed, built and shipped end-to-end.
          </p>
        </div>

        {/* Featured */}
        <div className="relative mb-12 group">
          {/* Glowing border */}
          <div className="absolute -inset-px rounded-[2rem] bg-gradient-primary opacity-70 blur-md group-hover:opacity-100 transition-opacity animate-pulse-glow" />
          <div className="relative glass rounded-[2rem] p-8 sm:p-12 overflow-hidden border-accent/50">
            <div className="absolute top-6 right-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-glow-primary">
              <Star className="h-3 w-3 fill-current" /> FEATURED
            </div>

            <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 items-center">
              <div>
                <p className="font-mono text-xs text-accent mb-3">Flagship Project</p>
                <h3 className="font-display text-4xl sm:text-5xl font-bold mb-4">
                  <span className="text-gradient">{featured.name}</span>
                </h3>
                <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                  {featured.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-7">
                  {featured.tags.map((t) => (
                    <span key={t} className="rounded-full bg-accent/10 border border-accent/30 px-3 py-1 font-mono text-xs text-accent">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a href="#" className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:scale-105">
                    <ExternalLink className="h-4 w-4" /> View Demo
                  </a>
                  <a href="https://github.com/atikhasan2042" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border glass px-6 py-3 font-semibold text-foreground hover:border-accent/60 hover:text-accent transition-colors">
                    <Github className="h-4 w-4" /> Source
                  </a>
                </div>
              </div>

              <div className="flex justify-center animate-float">
                <PhoneMockup accent={featured.accent} initials={featured.initials} />
              </div>
            </div>
          </div>
        </div>

        {/* Other projects */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((p) => (
            <SmallCard key={p.name} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
};
