import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, Image as ImageIcon, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, galleryRes] = await Promise.all([
          supabase.from("events").select("*", { count: "exact", head: true }),
          supabase.from("gallery_images").select("*", { count: "exact", head: true })
        ]);

        setStats({
          events: eventsRes.count || 0,
          gallery: galleryRes.count || 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="animate-pulse flex gap-4">Loading stats...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to the RAGLA Website Administration Panel. Select a module from the sidebar to manage content.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Events Stat Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <p className="text-xs text-muted-foreground">
              Published events and achievements
            </p>
          </CardContent>
        </Card>

        {/* Gallery Stat Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gallery Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.gallery}</div>
            <p className="text-xs text-muted-foreground">
              Images in the public gallery
            </p>
          </CardContent>
        </Card>

        {/* Active Admins (Static Placeholder) */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Session</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              You are currently logged in
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
