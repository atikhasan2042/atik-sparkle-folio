import { GraduationCap, Code2, Rocket, Coffee, Users } from "lucide-react";

const stats = [
  { Icon: Code2, value: "3+", label: "Years Coding" },
  { Icon: Rocket, value: "10+", label: "Apps Built" },
  { Icon: Users, value: "20+", label: "Happy Clients" },
  { Icon: Coffee, value: "∞", label: "Cups of Tea" },
];

export const About = () => {
  return (
    <section id="about" className="relative py-28 sm:py-32">
      <div className="container relative z-10">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 items-start">
          {/* Left column */}
          <div className="space-y-6">
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold">
              About <span className="text-gradient">Me</span>
            </h2>

            <div className="inline-flex items-center gap-3 rounded-2xl glass px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary">
                <GraduationCap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Currently studying at</p>
                <p className="text-sm font-semibold text-foreground">Northern University Bangladesh</p>
              </div>
            </div>

            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                I'm Atik — an app developer and software engineer based in Bangladesh. I love
                turning rough ideas into shipped products that people actually enjoy using,
                from the first wireframe to the final Play Store release.
              </p>
              <p>
                My focus is on cross-platform mobile apps with Flutter, Firebase backends, and
                native Android with Java. When I'm not coding, you'll find me exploring new
                places (which inspired my flagship app, Tour Partner) or learning the next thing.
              </p>
            </div>
          </div>

          {/* Right column — stats */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map(({ Icon, value, label }, i) => (
              <div
                key={label}
                className="group relative glass rounded-3xl p-6 sm:p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/50 hover:shadow-glow-primary"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-3xl bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="font-display text-4xl sm:text-5xl font-bold text-gradient">{value}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
