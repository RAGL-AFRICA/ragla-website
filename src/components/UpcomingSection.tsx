import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Calendar } from "lucide-react";
import upcomingImg from "@/assets/upcoming-event.jpg"; // fallback

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
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleDescription = (id: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (eventsError) throw eventsError;

        const { data: postsData, error: postsError } = await supabase
          .from("news_posts")
          .select("id, title, content, category, image_url, published_at, created_at")
          .in("category", ["news", "post"])
          .order("published_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false });

        // If news_posts table is not yet created, still render events.
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
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming Events, News and Posts
          </h2>
          <p className="text-muted-foreground">Showing latest 10 updates across all categories.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, index) => {
            const eventDate = item.displayDate
              ? new Date(item.displayDate).toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "Date to be announced";

            return (
              <motion.article
                key={`${item.itemType}-${item.id}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
                className="rounded-2xl overflow-hidden border border-border bg-card card-shadow"
              >
                <img
                  src={item.image_url || upcomingImg}
                  alt={item.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-primary">
                      {item.itemType}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground break-words">{item.title}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {eventDate}
                  </p>
                  {item.location && (
                    <p className="text-sm text-muted-foreground break-words">
                      <span className="text-primary font-medium">Location:</span> {item.location}
                    </p>
                  )}
                  {item.description && (
                    <div>
                      <p
                        className={`text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words ${
                          expandedItems.has(item.id) ? "" : "line-clamp-3"
                        }`}
                      >
                        {item.description}
                      </p>
                      {item.description.length > 160 && (
                        <button
                          type="button"
                          onClick={() => toggleDescription(item.id)}
                          className="text-primary text-xs font-medium mt-1 hover:underline"
                        >
                          {expandedItems.has(item.id) ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <Link to="/events" className="px-4 py-2 rounded-lg border border-border hover:border-primary text-sm font-medium">
            View all events
          </Link>
          <Link to="/news" className="px-4 py-2 rounded-lg border border-border hover:border-primary text-sm font-medium">
            View all news
          </Link>
          <Link to="/posts" className="px-4 py-2 rounded-lg border border-border hover:border-primary text-sm font-medium">
            View all posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default UpcomingSection;

