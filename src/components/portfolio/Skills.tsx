import { useEffect, useRef, useState } from "react";

const skills = [
  { name: "Flutter", level: 92, color: "from-sky-400 to-blue-500" },
  { name: "Dart", level: 90, color: "from-cyan-400 to-blue-500" },
  { name: "Firebase", level: 85, color: "from-amber-400 to-orange-500" },
  { name: "Android (Java)", level: 80, color: "from-emerald-400 to-teal-500" },
  { name: "Python", level: 75, color: "from-yellow-400 to-amber-500" },
  { name: "Git & GitHub", level: 88, color: "from-rose-400 to-pink-500" },
  { name: "UI / UX Design", level: 78, color: "from-fuchsia-400 to-purple-500" },
  { name: "REST APIs", level: 82, color: "from-indigo-400 to-violet-500" },
  { name: "C", level: 75, color: "from-slate-400 to-slate-600" },
  { name: "C++", level: 72, color: "from-blue-400 to-indigo-600" },
  { name: "HTML5", level: 80, color: "from-orange-400 to-red-500" },
  { name: "CSS3", level: 78, color: "from-blue-400 to-sky-600" },
  { name: "JavaScript", level: 70, color: "from-yellow-300 to-amber-500" },
];

export const Skills = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="skills" className="relative py-28 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
      <div className="container relative z-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            My <span className="text-gradient">Toolbox</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Languages, frameworks and tools I reach for when shipping production apps.
          </p>
        </div>

        <div ref={ref} className="grid md:grid-cols-2 gap-x-10 gap-y-7">
          {skills.map((s, i) => (
            <div key={s.name} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="font-display font-semibold text-foreground">{s.name}</span>
                <span className="font-mono text-sm text-muted-foreground">{s.level}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-[1400ms] ease-out`}
                  style={{
                    width: visible ? `${s.level}%` : "0%",
                    transitionDelay: `${i * 80}ms`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
