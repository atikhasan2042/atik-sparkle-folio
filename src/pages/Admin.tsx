import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  MessageSquare, 
  Clock, 
  Globe, 
  LogOut, 
  Eye,
  Mail,
  Smartphone,
  Monitor
} from "lucide-react";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Visitor = Database["public"]["Tables"]["visitors"]["Row"];
type ContactMessage = Database["public"]["Tables"]["contact_messages"]["Row"];

const Admin = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [stats, setStats] = useState({
    totalVisitors: 0,
    uniqueSessions: 0,
    avgDuration: 0,
    totalMessages: 0,
    unreadMessages: 0,
  });

  useEffect(() => {
    // Check session
    const checkSession = async () => {
      const { data: { session } } = await lovable.auth.getSession();
      if (!session) {
        navigate("/admin/login");
        return;
      }
      setSession(session);
      
      // Check if admin
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .eq("role", "admin");
      
      if (!roles || roles.length === 0) {
        await lovable.auth.signOut();
        navigate("/admin/login");
        return;
      }
      
      fetchData();
    };
    
    checkSession();
  }, [navigate]);

  const fetchData = async () => {
    // Fetch visitors
    const { data: visitorsData } = await supabase
      .from("visitors")
      .select("*")
      .order("visited_at", { ascending: false })
      .limit(100);
    
    if (visitorsData) {
      setVisitors(visitorsData);
      
      // Calculate stats
      const uniqueSessions = new Set(visitorsData.map(v => v.session_id)).size;
      const avgDuration = visitorsData.reduce((acc, v) => acc + (v.duration_seconds || 0), 0) / visitorsData.length || 0;
      
      setStats(prev => ({
        ...prev,
        totalVisitors: visitorsData.length,
        uniqueSessions,
        avgDuration: Math.round(avgDuration / 60), // in minutes
      }));
    }
    
    // Fetch messages
    const { data: messagesData } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (messagesData) {
      setMessages(messagesData);
      const unread = messagesData.filter(m => !m.is_read).length;
      setStats(prev => ({
        ...prev,
        totalMessages: messagesData.length,
        unreadMessages: unread,
      }));
    }
  };

  const handleLogout = async () => {
    await lovable.auth.signOut();
    navigate("/admin/login");
  };

  const markAsRead = async (id: string) => {
    await supabase
      .from("contact_messages")
      .update({ is_read: true })
      .eq("id", id);
    fetchData();
  };

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType) {
      case "mobile": return <Smartphone className="w-4 h-4" />;
      case "tablet": return <Monitor className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  if (!session) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {session?.user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVisitors}</div>
              <p className="text-xs text-muted-foreground">
                {stats.uniqueSessions} unique sessions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Session</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgDuration}m</div>
              <p className="text-xs text-muted-foreground">
                Average time on site
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalMessages}</div>
              <p className="text-xs text-muted-foreground">
                {stats.unreadMessages} unread
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(visitors.map(v => v.country).filter(Boolean)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                Unique countries
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Visitors */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Recent Visitors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4">Time</th>
                    <th className="text-left py-2 px-4">Country</th>
                    <th className="text-left py-2 px-4">City</th>
                    <th className="text-left py-2 px-4">Page</th>
                    <th className="text-left py-2 px-4">Device</th>
                    <th className="text-left py-2 px-4">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {visitors.slice(0, 20).map((visitor) => (
                    <tr key={visitor.id} className="border-b hover:bg-muted/50">
                      <td className="py-2 px-4">
                        {new Date(visitor.visited_at).toLocaleString()}
                      </td>
                      <td className="py-2 px-4">{visitor.country || "-"}</td>
                      <td className="py-2 px-4">{visitor.city || "-"}</td>
                      <td className="py-2 px-4 text-xs">{visitor.page_path || "/"}</td>
                      <td className="py-2 px-4">
                        <span className="flex items-center gap-1">
                          {getDeviceIcon(visitor.device_type)}
                          <span className="capitalize">{visitor.device_type || "desktop"}</span>
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        {visitor.duration_seconds 
                          ? `${Math.round(visitor.duration_seconds / 60)}m` 
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Contact Messages */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`p-4 rounded-lg border ${msg.is_read ? 'bg-muted/50' : 'bg-primary/5 border-primary/20'}`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold">{msg.name}</h4>
                      <p className="text-sm text-muted-foreground">{msg.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!msg.is_read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 text-sm">{msg.message}</p>
                  {!msg.is_read && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => markAsRead(msg.id)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No messages yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Admin;
