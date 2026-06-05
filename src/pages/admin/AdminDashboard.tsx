import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, FileText, Image as ImageIcon, Users, GraduationCap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    events: 0,
    gallery: 0,
    membershipApps: 0,
    programmeApps: 0,
    pendingProgrammeApps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, galleryRes, membershipRes, programmeRes, pendingProgrammeRes] = await Promise.all([
          supabase.from("events").select("*", { count: "exact", head: true }),
          supabase.from("gallery_images").select("*", { count: "exact", head: true }),
          supabase.from("membership_applications").select("*", { count: "exact", head: true }),
          supabase.from("programme_applications").select("*", { count: "exact", head: true }),
          supabase
            .from("programme_applications")
            .select("*", { count: "exact", head: true })
            .eq("status", "pending"),
        ]);

        setStats({
          events: eventsRes.count || 0,
          gallery: galleryRes.count || 0,
          membershipApps: membershipRes.count || 0,
          programmeApps: programmeRes.count || 0,
          pendingProgrammeApps: pendingProgrammeRes.count || 0,
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Programme Applications */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold">Programme Apps</CardTitle>
            <GraduationCap className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-primary">{stats.programmeApps}</div>
            <p className="text-xs font-semibold text-muted-foreground">
              {stats.pendingProgrammeApps} new admissions
            </p>
          </CardContent>
        </Card>

        {/* Membership Applications */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Membership Apps</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.membershipApps}</div>
            <p className="text-xs text-muted-foreground">
              General community applications
            </p>
          </CardContent>
        </Card>

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
      </div>
    </div>
  );
};

export default AdminDashboard;
