import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";
import { Loader2, ShieldCheck } from "lucide-react";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/admin", { replace: true });
      else setChecking(false);
    });
  }, [navigate]);

  const signIn = async () => {
    setLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/admin`,
      });
      if (result.error) {
        toast.error("Sign-in failed", { description: result.error.message });
        setLoading(false);
      }
    } catch (err) {
      toast.error("Sign-in error");
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md glass rounded-3xl p-8 sm:p-10 text-center space-y-6">
        <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-glow-primary">
          <ShieldCheck className="h-8 w-8 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground">
            Sign in with the authorized Google account to view your dashboard.
          </p>
        </div>
        <button
          onClick={signIn}
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-gradient-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-glow-primary transition-transform hover:scale-[1.02] disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path fill="#fff" d="M21.35 11.1H12v3.2h5.35c-.23 1.45-1.7 4.25-5.35 4.25-3.22 0-5.85-2.66-5.85-5.95s2.63-5.95 5.85-5.95c1.83 0 3.06.78 3.76 1.45l2.56-2.47C16.7 3.99 14.55 3 12 3 6.98 3 3 6.98 3 12s3.98 9 9 9c5.2 0 8.65-3.66 8.65-8.8 0-.6-.07-1.05-.15-1.5z"/>
            </svg>
          )}
          Continue with Google
        </button>
        <p className="text-xs text-muted-foreground">
          Only the owner's account can access this area.
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;