import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Calendar, Share2, ArrowRight } from "lucide-react";
import upcomingImg from "@/assets/upcoming-event.jpg"; // fallback
import { Badge } from "@/components/ui/badge";
import { getEventStatus } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import EventShareButtons from "@/components/EventShareButtons";

type EventType = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  speaker_name: string | null;
  speaker_title: string | null;
  speaker_image_url: string | null;
  created_at: string;
};

type NewsPostType = {
  id: string;
  title: string;
  content: string | null;
  category: "news" | "post";
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

type CombinedItem = {
  id: string;
  itemType: "event" | "news" | "post";
  title: string;
  description: string | null;
  image_url: string | null;
  displayDate: string | null;
  sortDate: string;
  location: string | null;
  speaker_name?: string | null;
  speaker_title?: string | null;
  speaker_image_url?: string | null;
};

const UpcomingSection = () => {
  const [items, setItems] = useState<CombinedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventsWithForms, setEventsWithForms] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("id, title, description, date, location, image_url, created_at, speaker_name, speaker_title, speaker_image_url")
          .order("date", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (eventsError) throw eventsError;

        // Fetch events that have registration forms
        const { data: formData } = await supabase
          .from("event_registration_forms")
          .select("event_id");
        
        if (formData) {
          setEventsWithForms(new Set(formData.map(f => f.event_id)));
        }

        const { data: postsData, error: postsError } = await supabase
          .from("news_posts")
          .select("id, title, content, category, image_url, published_at, created_at")
          .in("category", ["news", "post"])
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (postsError && !postsError.message.toLowerCase().includes("news_posts")) throw postsError;

        const combined: CombinedItem[] = [
          ...((eventsData || []) as EventType[]).map((event) => ({
            id: event.id,
            itemType: "event" as const,
            title: event.title,
            description: event.description,
            image_url: event.image_url,
            displayDate: event.date,
            sortDate: event.date || event.created_at,
            location: event.location,
            speaker_name: event.speaker_name,
            speaker_title: event.speaker_title,
            speaker_image_url: event.speaker_image_url,
          })),
          ...(((postsData || []) as NewsPostType[]).map((post) => ({
            id: post.id,
            itemType: post.category,
            title: post.title,
            description: post.content,
            image_url: post.image_url,
            displayDate: post.published_at,
            sortDate: post.published_at || post.created_at,
            location: null,
          }))),
        ]
          .sort((a, b) => new Date(b.sortDate).getTime() - new Date(a.sortDate).getTime())
          .slice(0, 10);

        setItems(combined);
      } catch (error) {
        console.error("Error fetching upcoming feed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (loading) {
    return (
      <section id="upcoming" className="section-padding bg-background min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section id="upcoming" className="section-padding bg-background">
        <div className="container-main text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay Tuned
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are currently preparing updates. Check back soon for upcoming events, latest news, and posts.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="upcoming" className="section-padding bg-background">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
            Latest <span className="text-primary italic">Updates</span>
          </h2>
          <p className="text-muted-foreground font-medium">Discover our upcoming summits, news, and exclusive insights.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const status = item.itemType === "event" ? getEventStatus(item.displayDate) : null;
            const hasRegistration = eventsWithForms.has(item.id);
            const canRegister = item.itemType === "event" && hasRegistration && status !== "Past";
            const detailUrl = item.itemType === "event" ? `/events/${item.id}` : (item.itemType === "news" ? "/news" : "/posts");

            return (
              <motion.article
                key={`${item.itemType}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
                className="group flex flex-col rounded-[3rem] border border-primary/20 bg-[#00122e] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-2 relative"
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Status Badge for events */}
                {item.itemType === "event" && status && (
                  <div className="absolute top-6 right-6 z-20">
                    {status === "Upcoming" && (
                      <Badge className="bg-primary hover:bg-primary border-none text-[#00122e] shadow-[0_0_20px_rgba(var(--primary),0.4)] px-4 py-1.5 rounded-full font-black tracking-widest text-[10px] uppercase">Upcoming</Badge>
                    )}
                    {status === "Due" && (
                      <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-white shadow-lg px-4 py-1.5 rounded-full font-black tracking-widest text-[10px] uppercase">Due Soon</Badge>
                    )}
                    {status === "Past" && (
                      <Badge className="bg-white/10 hover:bg-white/20 border border-white/10 text-white/60 px-4 py-1.5 rounded-full font-black tracking-widest text-[10px] uppercase">Past</Badge>
                    )}
                  </div>
                )}

                {/* Event Image / Flyer */}
                <Link to={detailUrl} className="block relative h-64 overflow-hidden bg-[#001a3d]">
                  <img
                    src={item.image_url || upcomingImg}
                    alt={item.title}
                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#00122e] via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <div className="absolute bottom-6 left-8 z-20">
                    <span className="bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-[0.2em]">
                      {item.itemType === 'event' ? 'Executive Programme' : item.itemType}
                    </span>
                  </div>
                </Link>

                <div className="p-8 pt-2 flex-1 flex flex-col relative z-20">
                  <div className="flex-1 space-y-5">
                    <div className="space-y-3">
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                          {item.displayDate ? new Date(item.displayDate).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Official Release'}
                       </div>
                      <Link to={detailUrl}>
                        <h3 className="text-2xl font-black text-white leading-[1.15] tracking-tight line-clamp-2 group-hover:text-primary transition-colors uppercase">
                          {item.title}
                        </h3>
                      </Link>
                    </div>

                    {/* Speaker Info on Card */}
                    {item.itemType === "event" && item.speaker_name && (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                          <img 
                            src={item.speaker_image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"} 
                            alt={item.speaker_name}
                            className="w-full h-full object-cover grayscale hover:grayscale-0"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black uppercase tracking-widest text-primary">Speaker</p>
                          <p className="text-sm font-bold text-white truncate">{item.speaker_name}</p>
                        </div>
                      </div>
                    )}

                    {item.description && !item.speaker_name && (
                      <div
                        className="text-sm leading-relaxed text-white/50 line-clamp-2 font-medium overflow-hidden italic"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>

                  <div className="pt-8">
                    <div className="flex items-center gap-3">
                      <Button 
                        asChild 
                        className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${canRegister ? "bg-primary text-[#00122e] hover:shadow-[0_0_30px_rgba(var(--primary),0.3)]" : "bg-white/5 text-white hover:bg-white/10"}`} 
                        variant={canRegister ? "default" : "outline"}
                      >
                        <Link to={detailUrl}>
                          {canRegister ? "Register Now" : "View Details"}
                          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      
                      <button className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary group/share transition-all duration-300">
                         <Share2 className="w-5 h-5 text-white/70 group-hover:text-[#00122e]" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          <Button asChild variant="outline" className="rounded-xl px-8 h-12 font-bold tracking-tight text-xs uppercase">
            <Link to="/events">View All Events</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-xl px-8 h-12 font-bold tracking-tight text-xs uppercase">
            <Link to="/news">Latest News</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default UpcomingSection;

