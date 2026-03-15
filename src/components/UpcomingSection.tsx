import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Calendar } from "lucide-react";
import upcomingImg from "@/assets/upcoming-event.jpg"; // fallback

type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string;
};

const UpcomingSection = () => {
  const [event, setEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          // Get events that are in the future
          .gte("date", new Date().toISOString())
          .order("date", { ascending: true })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error; // ignore no rows
        setEvent(data);
      } catch (error) {
        console.error("Error fetching upcoming event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvent();
  }, []);

  if (loading) {
    return (
      <section id="upcoming" className="section-padding bg-background min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </section>
    );
  }

  // If no upcoming events in db, show a polished placeholder rather than breaking
  if (!event) {
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

  const eventDate = event.date 
    ? new Date(event.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Date to be announced';

  return (
    <section id="upcoming" className="section-padding bg-background">
      <div className="container-main grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Upcoming...
          </h2>
          <p className="text-primary text-2xl font-bold mb-2">
            {event.title}
          </p>
          <div className="space-y-2 mt-4">
            <p className="text-muted-foreground flex items-center gap-2">
               <Calendar className="w-4 h-4 text-primary" /> {eventDate}
            </p>
            {event.location && (
              <p className="text-muted-foreground flex items-center gap-2">
                <span className="text-primary">📍</span> {event.location}
              </p>
            )}
            {event.description && (
               <p className="text-foreground mt-4 leading-relaxed">
                 {event.description}
               </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-2xl overflow-hidden card-shadow"
        >
          <img
            src={event.image_url || upcomingImg}
            alt={event.title}
            className="w-full h-72 md:h-96 object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default UpcomingSection;

