import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabase";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar, MapPin, ChevronLeft, Globe, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getEventStatus } from "@/lib/utils";
import EventShareButtons from "@/components/EventShareButtons";
import EventRegistrationForm from "@/components/EventRegistrationForm";
import { FormField } from "@/components/admin/FormBuilder";

type EventItem = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  created_at: string;
};

const EventDetail = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [hasForm, setHasForm] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      
      try {
        setLoading(true);
        // 1. Fetch Event
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("id", eventId)
          .single();

        if (error) throw error;
        setEvent(data);

        // 2. Fetch Registration Form
        const { data: formData, error: formError } = await supabase
          .from("event_registration_forms")
          .select("fields")
          .eq("event_id", eventId)
          .maybeSingle();
        
        if (formData) {
          setFormFields(formData.fields);
          setHasForm(true);
        }

      } catch (error) {
        console.error("Error loading event", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-main py-20 flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground animate-pulse">Loading event details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container-main py-20 text-center">
          <h2 className="text-3xl font-bold mb-4">Event not found</h2>
          <Button asChild>
            <Link to="/events">Back to All Events</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const status = getEventStatus(event.date);
  const isExpired = status === "Past";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Helmet>
        <title>{event.title} | RAGLA Events</title>
        <meta name="description" content={event.description?.replace(/<[^>]*>/g, '').substring(0, 160) || "Join RAGLA for this event."} />
        <meta property="og:title" content={event.title} />
        <meta property="og:image" content={event.image_url || ""} />
        <meta property="og:type" content="event" />
      </Helmet>
      
      <Header />

      <main className="pb-20">
        {/* Event Header Section */}
        <div className="bg-secondary/30 border-b border-border mb-8">
          <div className="container-main py-10 md:py-16">
            <div className="max-w-4xl space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="ghost" asChild className="-ml-3 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
                  <Link to="/events">
                    <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                    Back to Events
                  </Link>
                </Button>
                {status === "Upcoming" && (
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Upcoming</Badge>
                )}
                {status === "Due" && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Happening Soon</Badge>
                )}
                {status === "Past" && (
                  <Badge className="bg-muted text-muted-foreground border-border px-3 py-1 text-[10px] font-bold uppercase tracking-wider">Past Event</Badge>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-balance leading-[1.1]">
                {event.title}
              </h1>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-y-4 gap-x-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mb-0.5">Date & time</p>
                    <p className="text-sm font-semibold">
                       {event.date
                        ? new Date(event.date).toLocaleString("en-US", {
                            weekday: 'short',
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })
                        : "TBA"}
                    </p>
                  </div>
                </div>

                {event.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-primary/70 mb-0.5">Location</p>
                      <p className="text-sm font-semibold truncate max-w-[200px] sm:max-w-none">{event.location}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-12">
            <div className="space-y-10 min-w-0">
              {/* Feature Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-border bg-card group aspect-[16/9] lg:aspect-auto lg:h-[450px]">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-4">
                    <Calendar className="w-20 h-20 opacity-10" />
                    <p className="text-sm font-medium tracking-widest uppercase">Official RAGLA Event Flyer</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
              </div>

              <div className="pt-4 px-1">
                {/* Description */}
                <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none border-t border-border/50 pt-10 break-words overflow-hidden">
                  {event.description ? (
                    <div dangerouslySetInnerHTML={{ __html: event.description }} />
                  ) : (
                    <p className="italic text-muted-foreground">No detailed description available for this event.</p>
                  )}
                </div>
                
                {/* Social Share below content */}
                <div className="pt-10 border-t border-border">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-secondary/50 border border-border shadow-sm">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-primary" />
                        Invite your network
                      </h3>
                      <p className="text-sm text-muted-foreground">Share this event with colleagues across social media.</p>
                    </div>
                    <EventShareButtons eventId={event.id} eventTitle={event.title} />
                  </div>
                  </div>
                </div>
            </div>

            {/* Sidebar - Registration Form */}
            <aside className="space-y-6 lg:min-w-0">
              <div className="sticky top-28 space-y-6">
                <div className="p-5 sm:p-8 rounded-2xl bg-card border border-border shadow-xl relative overflow-hidden">
                  {/* Glass background decoration */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl"></div>
                  
                  <h3 className="text-2xl font-bold mb-6 relative">
                    Event Registration
                  </h3>

                  {!hasForm ? (
                    <div className="space-y-4 text-center py-4">
                      <div className="bg-muted/30 p-4 rounded-xl border border-dashed text-sm text-muted-foreground">
                        No registration form is required for this event. You can attend directly at the location.
                      </div>
                      <Button className="w-full" asChild variant="outline">
                         <Link to="/contact-us">Inquire via Contact Form</Link>
                      </Button>
                    </div>
                  ) : isExpired ? (
                    <div className="space-y-4 text-center py-4">
                      <div className="bg-muted/50 p-6 rounded-xl border border-border text-sm font-medium">
                        Registration is closed as this event has already taken place.
                      </div>
                      <Button className="w-full" asChild variant="secondary">
                        <Link to="/events">View Past Events Gallery</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="animate-in fade-in duration-500">
                      <p className="text-sm text-muted-foreground mb-6">
                        Complete the form below to secure your spot. We'll send you further details via the contact method provided.
                      </p>
                      <EventRegistrationForm 
                        eventId={event.id} 
                        fields={formFields} 
                        eventTitle={event.title}
                        eventDate={event.date}
                        eventLocation={event.location}
                      />
                    </div>
                  )}
                </div>
                
                {/* Organiser Info / Help */}
                <div className="p-6 rounded-2xl border border-border bg-muted/20">
                   <h4 className="font-bold mb-2 flex items-center gap-2">
                     <Globe className="w-4 h-4 text-primary" />
                     About the organiser
                   </h4>
                   <p className="text-sm text-muted-foreground mb-4">
                     Royal Academy of Governance and Leadership Africa (RAGLA) is committed to building leadership capacity across Africa.
                   </p>
                   <Button variant="link" className="p-0 h-auto text-primary" asChild>
                     <Link to="/about-us">Learn more about RAGLA</Link>
                   </Button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventDetail;
