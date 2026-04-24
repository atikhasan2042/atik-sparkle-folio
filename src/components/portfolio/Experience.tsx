import { Briefcase, GraduationCap, Sparkles, Palette, Megaphone, Languages } from "lucide-react";

const items = [
  {
    Icon: Sparkles,
    period: "2024 — Present",
    title: "Founder & Lead Developer",
    org: "Independent / Freelance",
    description:
      "Designing and shipping mobile apps for clients across travel, productivity and education niches. Flagship project: Tour Partner.",
  },
  {
    Icon: Briefcase,
    period: "2023 — 2024",
    title: "Flutter Developer",
    org: "Open-source & Personal Projects",
    description:
      "Built 8+ cross-platform apps with Flutter and Firebase. Focused on clean architecture, performance and pixel-perfect UI.",
  },
  {
    Icon: Palette,
    period: "2025 — Present",
    title: "Graphics Secretary",
    org: "NUB Computer Club (NUBCC)",
    description:
      "Leading visual branding for the CSE department's tech club — designing posters, social content and event graphics for workshops and programming contests.",
  },
  {
    Icon: Megaphone,
    period: "2025 — Present",
    title: "Campus Ambassador",
    org: "Techboloy",
    description:
      "Driving student engagement around tech workshops and skill-development events on campus, growing Techboloy's reach within the university.",
  },
  {
    Icon: Languages,
    period: "2025 — Present",
    title: "Campus Ambassador",
    org: "English Quest",
    description:
      "Promoting communication and English-language programs on campus, helping peers level up their professional and personal soft skills.",
  },
  {
    Icon: GraduationCap,
    period: "2022 — Present",
    title: "B.Sc. in Computer Science",
    org: "Northern University Bangladesh",
    description:
      "Studying CSE while building real products on the side. Interests: mobile systems, UX engineering and applied AI.",
  },
];

export const Experience = () => {
  return (
    <section id="experience" className="relative py-28 sm:py-32">
      <div className="container relative z-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Experience & <span className="text-gradient">Education</span>
          </h2>
          <p className="text-muted-foreground text-lg">A short timeline of where I've been and what I'm working on.</p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-5 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary via-accent to-transparent sm:-translate-x-1/2" aria-hidden="true" />

          <div className="space-y-12 sm:space-y-16">
            {items.map(({ Icon, period, title, org, description }, i) => {
              const left = i % 2 === 0;
              return (
                <div key={title} className={`relative flex sm:items-center gap-6 sm:gap-0 ${left ? "sm:flex-row" : "sm:flex-row-reverse"}`}>
                  {/* Dot */}
                  <div className="absolute left-5 sm:left-1/2 sm:-translate-x-1/2 -translate-x-1/2 z-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary shadow-glow-primary ring-4 ring-background">
                      <Icon className="h-4.5 w-4.5 text-primary-foreground" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-16 sm:ml-0 sm:w-[calc(50%-3rem)] ${left ? "sm:mr-auto sm:pr-12" : "sm:ml-auto sm:pl-12"}`}>
                    <div className="glass rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow-accent">
                      <p className="font-mono text-xs text-accent mb-2">{period}</p>
                      <h3 className="font-display text-xl font-bold text-foreground">{title}</h3>
                      <p className="text-sm text-primary font-medium mb-3">{org}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
