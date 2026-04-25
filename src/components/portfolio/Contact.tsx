import { useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin, Facebook } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  message: z.string().trim().min(5, "Message is too short").max(2000),
});

export const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    try {
      const { name, email, message } = parsed.data;
      const { data, error } = await supabase
        .from("contact_messages")
        .insert({ name, email, message })
        .select("id")
        .single();
      if (error) throw error;

      // Fire-and-forget email notification
      supabase.functions
        .invoke("send-contact-email", { body: { messageId: data.id } })
        .catch((err) => console.warn("Email notification failed:", err));

      toast.success("Message sent!", {
        description: "Atik will get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Could not send message", {
        description: "Please try again or email directly.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="contact" className="relative py-28 sm:py-32">
      <div className="absolute inset-0 grid-bg opacity-50" aria-hidden="true" />
      <div className="blob h-[300px] w-[300px] bg-accent/30 top-20 right-0 animate-blob-move" aria-hidden="true" />

      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Let's Build Something <span className="text-gradient">Together</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Have an idea, a project, or just want to say hi? My inbox is always open.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8">
          {/* Info column */}
          <div className="space-y-4">
            {[
              { Icon: Mail, label: "Email", value: "atikhasan.io2042@gmail.com", href: "mailto:atikhasan.io2042@gmail.com" },
              { Icon: Phone, label: "Phone", value: "+880 1682 868870", href: "tel:+8801682868870" },
              { Icon: MapPin, label: "Location", value: "Dhaka, Bangladesh", href: null },
            ].map(({ Icon, label, value, href }) => {
              const Inner = (
                <div className="group glass rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-glow-primary">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="font-medium text-foreground break-all">{value}</p>
                  </div>
                </div>
              );
              return href ? (
                <a key={label} href={href} className="block">{Inner}</a>
              ) : (
                <div key={label}>{Inner}</div>
              );
            })}

            <div className="glass rounded-2xl p-5">
              <p className="text-xs text-muted-foreground mb-3">Find me online</p>
              <div className="flex gap-3">
                {[
                  { Icon: Github, href: "https://github.com/atikhasan2042", label: "GitHub" },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/atik-hasan-b51516331/", label: "LinkedIn" },
                  { Icon: Facebook, href: "https://www.facebook.com/atik.hasan.510156", label: "Facebook" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:text-accent hover:border-accent hover:-translate-y-1"
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 sm:p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
              <textarea
                id="message"
                required
                rows={6}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-xl bg-background/60 border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors resize-none"
                placeholder="Tell me about your project…"
              />
            </div>
            <button
              type="submit"
              disabled={sending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {sending ? "Sending…" : (<><Send className="h-4 w-4" /> Send Message</>)}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};