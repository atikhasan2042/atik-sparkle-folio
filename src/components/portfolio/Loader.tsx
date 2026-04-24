import { useEffect, useState } from "react";

export const Loader = () => {
  const [hidden, setHidden] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1100);
    const t2 = setTimeout(() => setHidden(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-background transition-opacity duration-500 ${fading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
      aria-hidden="true"
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute h-32 w-32 rounded-full border-2 border-primary/30 animate-spin-slow" />
        <div className="absolute h-40 w-40 rounded-full border border-accent/20 animate-spin-slow" style={{ animationDirection: "reverse" }} />
        <div className="font-display text-5xl font-bold text-gradient">AH</div>
      </div>
    </div>
  );
};
