import { supabase } from "@/integrations/supabase/client";

const SESSION_KEY = "atik_visitor_session";
const VISIT_ROW_KEY = "atik_visit_row";
const VISIT_START_KEY = "atik_visit_start";

const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const detectDevice = (ua: string) => {
  if (/mobile|iphone|ipod|android.*mobile/i.test(ua)) return "Mobile";
  if (/ipad|tablet|android(?!.*mobile)/i.test(ua)) return "Tablet";
  return "Desktop";
};

const detectBrowser = (ua: string) => {
  if (/edg\//i.test(ua)) return "Edge";
  if (/chrome\//i.test(ua) && !/edg\//i.test(ua)) return "Chrome";
  if (/firefox\//i.test(ua)) return "Firefox";
  if (/safari\//i.test(ua) && !/chrome\//i.test(ua)) return "Safari";
  if (/opera|opr\//i.test(ua)) return "Opera";
  return "Other";
};

const detectOS = (ua: string) => {
  if (/windows nt/i.test(ua)) return "Windows";
  if (/mac os x/i.test(ua) && !/mobile/i.test(ua)) return "macOS";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/linux/i.test(ua)) return "Linux";
  return "Other";
};

const fetchGeo = async (): Promise<{ country?: string; city?: string }> => {
  try {
    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) return {};
    const data = await res.json();
    return { country: data.country_name, city: data.city };
  } catch {
    return {};
  }
};

export const trackVisit = async () => {
  if (typeof window === "undefined") return;
  // Avoid double-tracking in dev StrictMode
  if ((window as any).__atikTracked) return;
  (window as any).__atikTracked = true;

  try {
    const ua = navigator.userAgent;
    const sessionId = getSessionId();
    const geo = await fetchGeo();

    const { data, error } = await supabase
      .from("visitors")
      .insert({
        session_id: sessionId,
        page_path: window.location.pathname,
        referrer: document.referrer || null,
        user_agent: ua,
        device_type: detectDevice(ua),
        browser: detectBrowser(ua),
        os: detectOS(ua),
        country: geo.country || null,
        city: geo.city || null,
      })
      .select("id")
      .single();

    if (error || !data) return;

    sessionStorage.setItem(VISIT_ROW_KEY, data.id);
    sessionStorage.setItem(VISIT_START_KEY, String(Date.now()));

    const updateDuration = async () => {
      const rowId = sessionStorage.getItem(VISIT_ROW_KEY);
      const start = sessionStorage.getItem(VISIT_START_KEY);
      if (!rowId || !start) return;
      const seconds = Math.floor((Date.now() - parseInt(start, 10)) / 1000);
      await supabase
        .from("visitors")
        .update({ duration_seconds: seconds, last_active_at: new Date().toISOString() })
        .eq("id", rowId);
    };

    // Periodic heartbeat every 20s
    const interval = window.setInterval(updateDuration, 20000);

    // Update on tab close / hide
    window.addEventListener("beforeunload", updateDuration);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") updateDuration();
    });

    // Cleanup interval if SPA unmounts (rare for portfolio)
    (window as any).__atikInterval = interval;
  } catch (err) {
    console.warn("Visitor tracking failed:", err);
  }
};