import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bell, Megaphone } from "lucide-react";
import { motion } from "framer-motion";

type Announcement = {
  id: string;
  title: string;
  body: string;
  created_at: string;
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const { data, error } = await supabase
          .from("announcements")
          .select("*")
          .order("created_at", { ascending: false });

        if (error && error.code !== "42P01") throw error; // ignore if table doesn't exist yet
        setAnnouncements(data || []);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">

      <div className="pb-4 border-b border-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-amber-500/10">
            <Bell className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-foreground">Announcements</h1>
        </div>
        <p className="text-muted-foreground">Latest news, updates and communications from RAGLA.</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-28 bg-secondary rounded-2xl" />
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-2xl">
          <div className="p-4 rounded-full bg-amber-500/10 mb-4">
            <Megaphone className="w-10 h-10 text-amber-400 opacity-60" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No announcements yet</h3>
          <p className="text-muted-foreground text-sm text-center max-w-xs mt-2">
            When RAGLA posts important updates, they will appear here. Check back soon!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-6 rounded-2xl border border-border bg-card hover:border-amber-500/30 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-lg">{item.title}</h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{item.body}</p>
                </div>
                <div className="flex-shrink-0 p-2 rounded-lg bg-amber-500/10">
                  <Bell className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-4 font-mono">
                {new Date(item.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
};

export default Announcements;
