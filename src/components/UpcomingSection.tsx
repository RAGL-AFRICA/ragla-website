import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
};

const UpcomingSection = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleDescription = (id: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <section id="upcoming" className="section-padding bg-background min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section id="upcoming" className="section-padding bg-background">
        <div className="container-main text-center">
          <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-50" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Stay Tuned
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We are currently planning our next events. Check back soon for updates on upcoming summits, inductions, and seminars.
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
            Upcoming Events
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => {
            const eventDate = event.date
              ? new Date(event.date).toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })
              : "Date to be announced";

            return (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.25) }}
                className="rounded-2xl overflow-hidden border border-border bg-card card-shadow"
              >
                <img
                  src={event.image_url || upcomingImg}
                  alt={event.title}
                  className="w-full h-52 object-cover"
                />

                <div className="p-5 space-y-3">
                  <h3 className="text-xl font-bold text-foreground break-words">{event.title}</h3>
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {eventDate}
                  </p>
                  {event.location && (
                    <p className="text-sm text-muted-foreground break-words">
                      <span className="text-primary font-medium">Location:</span> {event.location}
                    </p>
                  )}
                  {event.description && (
                    <div>
                      <p
                        className={`text-sm text-foreground leading-relaxed whitespace-pre-wrap break-words ${
                          expandedEvents.has(event.id) ? "" : "line-clamp-3"
                        }`}
                      >
                        {event.description}
                      </p>
                      {event.description.length > 160 && (
                        <button
                          type="button"
                          onClick={() => toggleDescription(event.id)}
                          className="text-primary text-xs font-medium mt-1 hover:underline"
                        >
                          {expandedEvents.has(event.id) ? "Show less" : "Read more"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UpcomingSection;

