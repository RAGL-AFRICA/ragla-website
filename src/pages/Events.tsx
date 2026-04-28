import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEventStatus, EventStatus } from "@/lib/utils";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
};

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvents(data || []);
      } catch (error) {
        console.error("Error loading events", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>RAGLA Events | Leadership Summits & Governance Conferences</title>
        <meta name="description" content="Stay updated with RAGLA's upcoming events, seminars, and international conferences on governance and leadership across Africa." />
        <link rel="canonical" href="https://ragl-africa.org/events" />
      </Helmet>
      <Header />

      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">All Events</h1>
          <p className="text-muted-foreground mt-3">Browse all published events.</p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-xl bg-muted h-80" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No events yet</h3>
              <p className="text-muted-foreground">Published events will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => {
                const status = getEventStatus(event.date);
                return (
                <article key={event.id} className="rounded-xl border border-border bg-card overflow-hidden relative">
                  {status === "Upcoming" && (
                    <Badge className="bg-blue-500 hover:bg-blue-600 border-none text-white absolute top-4 right-4 shadow-md z-10">Upcoming</Badge>
                  )}
                  {status === "Due" && (
                    <Badge className="bg-amber-500 hover:bg-amber-600 border-none text-white absolute top-4 right-4 shadow-md z-10">Due</Badge>
                  )}
                  {status === "Past" && (
                    <Badge className="bg-gray-500 hover:bg-gray-600 border-none text-white absolute top-4 right-4 shadow-md z-10">Past</Badge>
                  )}
                  {event.image_url && <img src={event.image_url} alt={event.title} className="w-full h-52 object-cover" />}
                  <div className="p-5 space-y-3">
                    <h2 className="text-xl font-bold text-foreground break-words">{event.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {event.date
                        ? new Date(event.date).toLocaleString("en-US", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "Date to be announced"}
                    </p>
                    {event.location && (
                      <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-primary">Location:</span> {event.location}
                      </p>
                    )}
                    {event.description && <p className="text-sm text-foreground whitespace-pre-wrap">{event.description}</p>}
                  </div>
                </article>
              )})}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
