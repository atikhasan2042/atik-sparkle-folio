import { useState } from "react";
import { X, ImagePlus } from "lucide-react";

// To add photos: drop files into `src/assets/gallery/` and import them below.
// Then push into the `photos` array with a short caption.
const photoModules = import.meta.glob("@/assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const photos = Object.entries(photoModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, src]) => {
    const file = path.split("/").pop() ?? "";
    const caption = file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
    return { src, caption };
  });

export const Gallery = () => {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="gallery" className="relative py-28 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />
      <div className="container relative z-10">
        <div className="max-w-2xl mb-14">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Moments &amp; <span className="text-gradient">Gallery</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Snapshots from events, contests, workshops and the community work I’ve been part of.
          </p>
        </div>

        {photos.length === 0 ? (
          <div className="glass rounded-2xl p-10 flex flex-col items-center text-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
              <ImagePlus className="h-6 w-6 text-primary-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold">Gallery is ready for your photos</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Drop your event &amp; contest photos into <code className="font-mono text-accent">src/assets/gallery/</code> and they’ll
              appear here automatically.
            </p>
          </div>
        ) : (
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {photos.map((p, i) => (
              <button
                type="button"
                key={p.src}
                onClick={() => setActive(i)}
                className="group mb-4 block w-full overflow-hidden rounded-2xl border border-border/60 bg-surface relative break-inside-avoid focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <img
                  src={p.src}
                  alt={p.caption || `Gallery photo ${i + 1}`}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                  <span className="font-mono text-xs text-foreground capitalize">{p.caption}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {active !== null && photos[active] && (
          <div
            className="fixed inset-0 z-[100] bg-background/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10 animate-fade-in"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-5 right-5 rounded-full border border-border bg-surface p-2 text-foreground hover:bg-accent/20 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={photos[active].src}
              alt={photos[active].caption || "Gallery photo"}
              className="max-h-[85vh] max-w-full rounded-2xl shadow-glow-primary object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </div>
    </section>
  );
};
