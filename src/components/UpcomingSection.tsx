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
          .select("*")
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
                className="group flex flex-col rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.15)] hover:-translate-y-2 relative"
              >
                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Status Badge for events */}
                {item.itemType === "event" && status && (
                  <div className="absolute top-6 right-6 z-20">
                    {status === "Upcoming" && (
                      <Badge className="bg-primary hover:bg-primary border-none text-white shadow-[0_8px_16px_-4px_rgba(var(--primary),0.4)] px-4 py-1.5 rounded-full font-bold tracking-tight text-xs">Upcoming</Badge>
                    )}
                    {status === "Due" && (
                      <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-white shadow-lg px-4 py-1.5 rounded-full font-bold tracking-tight text-xs">Due Soon</Badge>
                    )}
                    {status === "Past" && (
                      <Badge className="bg-zinc-500 hover:bg-zinc-600 border-none text-white shadow-lg px-4 py-1.5 rounded-full font-bold tracking-tight text-xs">Past</Badge>
                    )}
                  </div>
                )}

                {/* News/Post Category Badge */}
                {item.itemType !== "event" && (
                  <div className="absolute top-6 right-6 z-20">
                    <Badge className="bg-secondary/80 backdrop-blur-md border-border/50 text-foreground px-4 py-1.5 rounded-full font-bold tracking-tight text-[10px] uppercase">{item.itemType}</Badge>
                  </div>
                )}

                <Link to={detailUrl} className="block relative h-60 overflow-hidden bg-muted m-3 rounded-[2rem]">
                  <img
                    src={item.image_url || upcomingImg}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
                </Link>

                <div className="p-8 pt-4 flex-1 flex flex-col">
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-80">
                         <span className="w-8 h-[2px] bg-primary/40"></span>
                         {item.displayDate ? new Date(item.displayDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent'}
                       </div>
                      <Link to={detailUrl}>
                        <h3 className="text-2xl font-extrabold text-foreground leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors break-words">
                          {item.title}
                        </h3>
                      </Link>
                    </div>

                    {item.description && (
                      <div
                        className="text-sm leading-relaxed text-muted-foreground line-clamp-2 opacity-80 font-medium overflow-hidden"
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}
                  </div>

                  <div className="pt-8 space-y-6">
                    <div className="flex items-center gap-4">
                      <Button 
                        asChild 
                        className={`flex-1 h-14 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300 ${canRegister ? "bg-primary hover:shadow-primary/30" : "bg-secondary/50 text-foreground"}`} 
                        variant={canRegister ? "default" : "outline"}
                      >
                        <Link to={detailUrl}>
                          {canRegister ? "Register Now" : "Read More"}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                      
                      {item.itemType === "event" && (
                        <div className="bg-secondary/30 p-2 rounded-xl flex items-center justify-center h-14 w-14 group/share cursor-pointer border border-border/30 hover:bg-secondary transition-colors">
                           <Share2 className="w-5 h-5 text-muted-foreground group-hover/share:text-primary transition-colors" />
                        </div>
                      )}
                    </div>

                    {item.itemType === "event" && (
                      <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="flex gap-3">
                            <EventShareButtons eventId={item.id} eventTitle={item.title} />
                         </div>
                      </div>
                    )}
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

