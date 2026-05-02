import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { Calendar, Share2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getEventStatus } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import EventShareButtons from "@/components/EventShareButtons";

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
  const [eventsWithForms, setEventsWithForms] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true, nullsFirst: false })
          .order("created_at", { ascending: false });

        if (error) throw error;
        setEvents(data || []);

        // Fetch events that have registration forms
        const { data: formData, error: formError } = await supabase
          .from("event_registration_forms")
          .select("event_id");
        
        if (formData) {
          setEventsWithForms(new Set(formData.map(f => f.event_id)));
        }

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

      <section className="section-padding bg-secondary/50">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">All Events</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Empowering leaders across Africa. Discover our upcoming summits, seminars, and governance conferences.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="rounded-2xl bg-muted h-[450px]" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-2xl border border-dashed border-border">
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No events yet</h3>
              <p className="text-muted-foreground">Published events will appear here.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => {
                const status = getEventStatus(event.date);
                const hasRegistration = eventsWithForms.has(event.id);
                const canRegister = hasRegistration && status !== "Past";

                return (
                  <article key={event.id} className="group flex flex-col rounded-[2.5rem] border border-border/50 bg-card/40 backdrop-blur-sm overflow-hidden transition-all duration-500 hover:shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] hover:-translate-y-2 relative">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Status Badge */}
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

                    {/* Image Container */}
                    <Link to={`/events/${event.id}`} className="block relative h-64 overflow-hidden bg-muted m-3 rounded-[2rem]">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground opacity-20">
                          <Calendar className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                    </Link>

                    <div className="p-8 pt-4 flex-1 flex flex-col">
                      <div className="flex-1 space-y-5">
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-80">
                             <span className="w-8 h-[2px] bg-primary/40"></span>
                             {event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'TBA'}
                           </div>
                          <Link to={`/events/${event.id}`}>
                            <h2 className="text-2xl font-extrabold text-foreground leading-tight tracking-tight line-clamp-2 group-hover:text-primary transition-colors break-words">
                              {event.title}
                            </h2>
                          </Link>
                        </div>

                        {event.description && (
                          <div 
                            className="text-sm leading-relaxed text-muted-foreground line-clamp-3 mb-4 opacity-80 font-medium"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                          />
                        )}
                      </div>

                      <div className="pt-8 space-y-6">
                        {/* Action Buttons */}
                        <div className="flex items-center gap-4">
                          <Button 
                            asChild 
                            className={`flex-1 h-14 rounded-2xl font-bold text-base shadow-xl transition-all duration-300 ${canRegister ? "bg-primary hover:shadow-primary/30" : "bg-secondary text-secondary-foreground"}`} 
                            variant={canRegister ? "default" : "outline"}
                          >
                            <Link to={`/events/${event.id}`}>
                              {canRegister ? "Register Now" : "Details"}
                              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                          </Button>
                          <div className="bg-secondary/50 p-2 rounded-xl flex items-center justify-center h-14 w-14 group/share cursor-pointer border border-border/30 hover:bg-secondary transition-colors">
                             <Share2 className="w-5 h-5 text-muted-foreground group-hover/share:text-primary transition-colors" />
                          </div>
                        </div>
                        
                        {/* Mini Social Row (Visible on hover or subtle) */}
                        <div className="flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity">
                             <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">Exclusive Event</span>
                             <div className="flex gap-3">
                                <EventShareButtons eventId={event.id} eventTitle={event.title} />
                             </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Events;
