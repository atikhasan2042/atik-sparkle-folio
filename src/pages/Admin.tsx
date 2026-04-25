import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  LogOut,
  Users,
  MessageSquare,
  Clock,
  Globe2,
  Smartphone,
  Loader2,
  Mail,
  RefreshCw,
  CheckCircle2,
  Circle,
} from "lucide-react";

type Visitor = {
  id: string;
  session_id: string;
  page_path: string | null;
  referrer: string | null;
  device_type: string | null;
  browser: string | null;
  os: string | null;
  country: string | null;
  city: string | null;
  duration_seconds: number;
  visited_at: string;
};

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  email_sent: boolean;
  created_at: string;
};

const Admin = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"overview" | "visitors" | "messages">("overview");

  // Auth gate
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) navigate("/admin/login", { replace: true });
    });
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) {
        navigate("/admin/login", { replace: true });
        return;
      }
      setUser(data.session.user);
      // Verify admin role
      const { data: roleRow } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!roleRow) {
        toast.error("Access denied", { description: "This account is not authorized." });
        await supabase.auth.signOut();
        navigate("/admin/login", { replace: true });
        return;
      }
      setAuthChecked(true);
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const fetchData = async () => {
    setLoading(true);
    const [v, m] = await Promise.all([
      supabase.from("visitors").select("*").order("visited_at", { ascending: false }).limit(500),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);
    if (v.data) setVisitors(v.data as Visitor[]);
    if (m.data) setMessages(m.data as Message[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!authChecked) return;
    fetchData();

    // Realtime subscription for new messages
    const channel = supabase
      .channel("admin-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "contact_messages" },
        (payload) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [newMsg, ...prev]);
          toast.success("📨 New message!", {
            description: `${newMsg.name} just sent a message`,
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "visitors" },
        (payload) => {
          setVisitors((prev) => [payload.new as Visitor, ...prev].slice(0, 500));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authChecked]);

  const stats = useMemo(() => {
    const uniqueSessions = new Set(visitors.map((v) => v.session_id)).size;
    const totalDuration = visitors.reduce((sum, v) => sum + (v.duration_seconds || 0), 0);
    const avgDuration = visitors.length ? Math.round(totalDuration / visitors.length) : 0;
    const today = new Date().toDateString();
    const todayVisits = visitors.filter((v) => new Date(v.visited_at).toDateString() === today).length;
    const unreadMessages = messages.filter((m) => !m.is_read).length;
    return { uniqueSessions, avgDuration, todayVisits, unreadMessages, totalVisits: visitors.length };
  }, [visitors, messages]);

  const topCountries = useMemo(() => {
    const map = new Map<string, number>();
    visitors.forEach((v) => {
      const c = v.country || "Unknown";
      map.set(c, (map.get(c) || 0) + 1);
    });
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [visitors]);

  const deviceBreakdown = useMemo(() => {
    const map = new Map<string, number>();
    visitors.forEach((v) => {
      const d = v.device_type || "Unknown";
      map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries());
  }, [visitors]);

  const markRead = async (id: string, isRead: boolean) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: !isRead })
      .eq("id", id);
    if (error) {
      toast.error("Could not update");
      return;
    }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: !isRead } : m)));
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login", { replace: true });
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 border-b border-border">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center font-display font-bold text-primary-foreground">
              AH
            </div>
            <div>
              <h1 className="font-display text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-primary/60 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Refresh
            </button>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:border-destructive/60 hover:text-destructive transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="container flex gap-1 pb-3">
          {([
            { id: "overview", label: "Overview" },
            { id: "visitors", label: `Visitors (${stats.totalVisits})` },
            { id: "messages", label: `Messages (${stats.unreadMessages})` },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                tab === t.id
                  ? "bg-primary/15 text-foreground border border-primary/40"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="container py-8 space-y-8">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : tab === "overview" ? (
          <>
            {/* Stat cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total visits" value={stats.totalVisits} />
              <StatCard icon={Globe2} label="Unique sessions" value={stats.uniqueSessions} />
              <StatCard icon={Clock} label="Avg time (sec)" value={stats.avgDuration} />
              <StatCard icon={MessageSquare} label="Unread messages" value={stats.unreadMessages} />
            </div>

            {/* Country + device breakdown */}
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <Globe2 className="h-4 w-4 text-primary" /> Top countries
                </h3>
                {topCountries.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {topCountries.map(([country, count]) => (
                      <li key={country} className="flex items-center justify-between text-sm">
                        <span>{country}</span>
                        <span className="font-mono text-muted-foreground">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="glass rounded-2xl p-6">
                <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                  <Smartphone className="h-4 w-4 text-primary" /> Devices
                </h3>
                {deviceBreakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No data yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {deviceBreakdown.map(([device, count]) => (
                      <li key={device} className="flex items-center justify-between text-sm">
                        <span>{device}</span>
                        <span className="font-mono text-muted-foreground">{count}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Latest messages */}
            <div className="glass rounded-2xl p-6">
              <h3 className="font-display font-bold mb-4 flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" /> Recent messages
              </h3>
              {messages.slice(0, 3).length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages yet.</p>
              ) : (
                <ul className="space-y-3">
                  {messages.slice(0, 3).map((m) => (
                    <li key={m.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm">{m.name}</p>
                        <span className="text-xs text-muted-foreground">
                          {new Date(m.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{m.email}</p>
                      <p className="text-sm whitespace-pre-wrap line-clamp-3">{m.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : tab === "visitors" ? (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface/50 text-muted-foreground text-xs uppercase">
                  <tr>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Page</th>
                    <th className="text-left p-3">Country</th>
                    <th className="text-left p-3">Device</th>
                    <th className="text-left p-3">Browser</th>
                    <th className="text-left p-3">OS</th>
                    <th className="text-left p-3">Duration</th>
                    <th className="text-left p-3">Referrer</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.length === 0 ? (
                    <tr><td colSpan={8} className="p-6 text-center text-muted-foreground">No visitors yet.</td></tr>
                  ) : visitors.map((v) => (
                    <tr key={v.id} className="border-t border-border hover:bg-surface/40">
                      <td className="p-3 whitespace-nowrap text-xs">{new Date(v.visited_at).toLocaleString()}</td>
                      <td className="p-3">{v.page_path || "/"}</td>
                      <td className="p-3">{v.country || "—"}{v.city ? `, ${v.city}` : ""}</td>
                      <td className="p-3">{v.device_type || "—"}</td>
                      <td className="p-3">{v.browser || "—"}</td>
                      <td className="p-3">{v.os || "—"}</td>
                      <td className="p-3 font-mono text-xs">{v.duration_seconds}s</td>
                      <td className="p-3 truncate max-w-[160px] text-xs text-muted-foreground">{v.referrer || "Direct"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="glass rounded-2xl p-10 text-center text-muted-foreground">
                No messages yet.
              </div>
            ) : (
              messages.map((m) => (
                <div
                  key={m.id}
                  className={`glass rounded-2xl p-6 ${!m.is_read ? "border-primary/40" : ""}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-display font-bold text-lg">{m.name}</h4>
                      <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">
                        {m.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleString()}
                      </span>
                      <button
                        onClick={() => markRead(m.id, m.is_read)}
                        className="text-xs inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-border hover:border-primary/60"
                      >
                        {m.is_read ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
                        {m.is_read ? "Read" : "Unread"}
                      </button>
                    </div>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{m.message}</p>
                  {m.email_sent && (
                    <p className="mt-3 text-xs text-muted-foreground">✓ Email forwarded to inbox</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value }: { icon: any; label: string; value: number | string }) => (
  <div className="glass rounded-2xl p-5">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs text-muted-foreground uppercase tracking-wider">{label}</span>
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <p className="font-display text-3xl font-bold">{value}</p>
  </div>
);

export default Admin;