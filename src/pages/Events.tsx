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
  speaker_name: string | null;
  speaker_title: string | null;
  speaker_image_url: string | null;
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
          .select("id, title, description, date, location, image_url, created_at, speaker_name, speaker_title, speaker_image_url")
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
                  <article key={event.id} className="group flex flex-col rounded-[3rem] border border-primary/20 bg-[#00122e] overflow-hidden transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] hover:-translate-y-2 relative text-white">
                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* Status Badge */}
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

                    {/* Image Container */}
                    <Link to={`/events/${event.id}`} className="block relative h-64 overflow-hidden bg-[#001a3d]">
                      {event.image_url ? (
                        <img 
                          src={event.image_url} 
                          alt={event.title} 
                          className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary/20">
                          <Calendar className="w-16 h-16" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#00122e] via-transparent to-transparent" />
                      {/* Category Pill */}
                      <div className="absolute bottom-6 left-8 z-20">
                        <span className="bg-primary/20 backdrop-blur-xl border border-primary/30 text-primary px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-[0.2em]">
                          Executive Programme
                        </span>
                      </div>
                    </Link>

                    <div className="p-8 pt-2 flex-1 flex flex-col relative z-20">
                      <div className="flex-1 space-y-5">
                        <div className="space-y-3">
                           <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                             {event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Official Schedule'}
                           </div>
                          <Link to={`/events/${event.id}`}>
                            <h2 className="text-2xl font-black text-white leading-[1.15] tracking-tight line-clamp-2 group-hover:text-primary transition-colors uppercase">
                              {event.title}
                            </h2>
                          </Link>
                        </div>

                        {/* Speaker Info on Card */}
                        {event.speaker_name && (
                          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 group-hover:border-primary/20 transition-colors">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30 shrink-0">
                              <img 
                                src={event.speaker_image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"} 
                                alt={event.speaker_name}
                                className="w-full h-full object-cover grayscale hover:grayscale-0"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase tracking-widest text-primary">Keynote Speaker</p>
                              <p className="text-sm font-bold text-white truncate">{event.speaker_name}</p>
                            </div>
                          </div>
                        )}

                        {event.description && !event.speaker_name && (
                          <div 
                            className="text-sm leading-relaxed text-white/50 line-clamp-3 mb-4 font-medium italic"
                            dangerouslySetInnerHTML={{ __html: event.description }}
                          />
                        )}
                      </div>

                      <div className="pt-8">
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <Button 
                            asChild 
                            className={`flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${canRegister ? "bg-primary text-[#00122e] hover:shadow-[0_0_30px_rgba(var(--primary),0.3)]" : "bg-white/5 text-white hover:bg-white/10"}`} 
                            variant={canRegister ? "default" : "outline"}
                          >
                            <Link to={`/events/${event.id}`}>
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
