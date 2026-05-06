import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Calendar, 
  Clock, 
  Users, 
  ClipboardCheck, 
  Gavel, 
  UserRound, 
  Target, 
  Mail, 
  Globe, 
  QrCode,
  ArrowRight,
  ShieldCheck,
  Award,
  Scale,
  Landmark,
  Star,
  Compass,
  Zap,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Share } from "lucide-react";
import { toast } from "sonner";
import EventRegistrationForm from "./EventRegistrationForm";
import { FormField } from "./admin/FormBuilder";

interface EventExecutiveSummaryProps {
  event: {
    id: string;
    title: string;
    description: string | null;
    date: string | null;
    location: string | null;
    image_url: string | null;
    speaker_name?: string | null;
    speaker_title?: string | null;
    speaker_bio?: string | null;
    speaker_image_url?: string | null;
  };
  formFields: FormField[];
}

const EventExecutiveSummary: React.FC<EventExecutiveSummaryProps> = ({ event, formFields }) => {
  const [email, setEmail] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const eventDate = event.date ? new Date(event.date) : null;
  const formattedDate = eventDate ? eventDate.toLocaleDateString("en-GB", {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }) : "Sunday, 10th May, 2026";
  
  const formattedTime = eventDate ? eventDate.toLocaleTimeString("en-GB", {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  }) : "17:00GMT";

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes("@")) {
      setIsDialogOpen(true);
    }
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/events/${event.id}`;
    if (navigator.share && navigator.canShare && navigator.canShare({ url: shareUrl })) {
      try {
        await navigator.share({
          title: event.title,
          text: `Join me at ${event.title} - An exclusive RAGLA Event`,
          url: shareUrl,
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast.success("Event link copied to clipboard!");
    }
  };

  return (
    <div className="relative group">
       {/* Card Share Actions Overlay */}
       <div className="absolute -top-14 right-0 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity z-30">
          <Button 
            onClick={handleShare}
            className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-primary hover:text-[#00122e] rounded-full px-6 font-black text-[10px] uppercase tracking-widest gap-2 shadow-2xl h-10"
          >
             <Share className="w-4 h-4" /> Share Programme
          </Button>
       </div>

       <div 
         className="max-w-5xl mx-auto my-12 bg-[#00122e] rounded-3xl overflow-hidden shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] border border-primary/20 text-white font-sans selection:bg-primary selection:text-[#00122e]"
       >
      {/* Top Header - Executive Summary */}
      <div className="relative p-5 sm:p-8 md:p-14 border-b border-white/5 overflow-hidden">
        {/* Background Decorative Element */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-6 md:gap-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6 max-w-2xl w-full"
          >
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black tracking-tighter text-primary leading-none">
              EXECUTIVE <br /> <span className="text-white">SUMMARY</span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl font-bold tracking-tight text-white/80 border-l-4 border-primary pl-4 sm:pl-6 py-2">
              Continues Professional Development (CPD) Programme
            </p>
            
            <div className="pt-4 md:pt-8">
               <div className="flex items-center gap-3 mb-3">
                  <div className="h-0.5 w-8 md:w-12 bg-primary" />
                  <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Programme Topic</p>
               </div>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-extrabold leading-tight text-white italic drop-shadow-lg">
                "{event.title}"
              </h2>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] flex flex-col gap-5 sm:gap-8 w-full md:min-w-[280px] md:max-w-[340px] shadow-2xl relative"
          >
             {/* Academy Crest */}
             <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                   <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-colors" />
                   <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.3)] relative z-10">
                      <Award className="w-12 h-12 text-[#00122e]" />
                   </div>
                </div>
                <div>
                   <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Royal Academy of</h4>
                   <p className="text-xs font-black uppercase tracking-[0.1em] text-white">Governance & Leadership Africa</p>
                   <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent mt-2" />
                   <p className="text-[8px] italic text-primary/60 mt-1">Servitum Integritas Phasellus</p>
                </div>
             </div>

             <div className="space-y-5 pt-6 border-t border-white/10">
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Scheduled Date</p>
                    <p className="text-base font-bold text-white">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/30 group-hover:bg-primary/20 transition-colors">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-primary/70">Session Time</p>
                    <p className="text-base font-bold text-white">{formattedTime}</p>
                  </div>
                </div>
             </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="p-5 sm:p-8 md:p-16 space-y-12 md:space-y-20">
        {/* Row 1: Reality & Expect */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-16">
          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="flex gap-4 md:gap-8"
          >
            <div className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-primary flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(var(--primary),0.3)] self-start">
               <Users className="w-7 h-7 sm:w-10 sm:h-10 text-[#00122e]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-primary">The Executive Reality</h3>
              <p className="text-sm leading-relaxed text-white/70 font-medium">
                In today's precarious executive environment, leaders are progressively challenged with a fragile balancing act: the quest to deliver the bottom-line under severe pressure, whilst upholding fidelity to integrity and promoting ethical standards. This programme is therefore designed to tackle that reality frontal by providing an authoritative, experiential exploration of how to sustain ethical integrity, even in the most challenging boardroom and leadership environments.
              </p>
            </div>
          </motion.div>

          <motion.div 
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            viewport={{ once: true }}
            className="flex gap-4 md:gap-8"
          >
            <div className="shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-[1.5rem] sm:rounded-[2rem] bg-primary flex items-center justify-center shadow-[0_15px_30px_-10px_rgba(var(--primary),0.3)] self-start">
               <ClipboardCheck className="w-7 h-7 sm:w-10 sm:h-10 text-[#00122e]" />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg sm:text-2xl font-black uppercase tracking-wider text-primary">What to Expect</h3>
              <p className="text-sm leading-relaxed text-white/70 font-medium">
                In this Programme, Participants will connect with case based analysis, executive dilemmas, and breakdown of governance scenarios drawn from lived leadership experiences. The programme refines critical lessons on how ethical lapses take place, not ignorance driven, but from delicate trade-offs, rationalizations, and contextual pressures—and how they can be avoided by virtue of principled leadership and vigorous governance systems.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Central Tools Section - Faithful to Flyer */}
        <div className="relative pt-10 px-1 border-t border-white/10">
           <div className="text-center space-y-12">
              <div className="inline-block px-8 py-2 bg-primary/10 border border-primary/20 rounded-full mb-4">
                 <h3 className="text-base md:text-xl font-black uppercase tracking-[0.4em] text-primary">
                    Practical Tools. Ethical Strength. Strategic Impact.
                 </h3>
              </div>
              
              <p className="text-base text-white/60 max-w-3xl mx-auto font-bold uppercase tracking-tight">
                 At the same time, the Programme is intended to equip Participants with workable models to reinforce ethical decision-making under pressure, including:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-12 pt-8">
                 {[
                   { 
                     icon: Scale, 
                     title: "Moral Clarity", 
                     desc: "Techniques for upholding moral clarity even in the most ambiguous circumstances" 
                   },
                   { 
                     icon: Compass, 
                     title: "Influence Strategy", 
                     desc: "Strategies for withstanding undue influence, whilst properly managing expectations of stakeholders" 
                   },
                   { 
                     icon: Landmark, 
                     title: "Governance Tools", 
                     desc: "Implementing effective tools of governance that promote accountability and transparency" 
                   },
                   { 
                     icon: UserRound, 
                     title: "Leadership Styles", 
                     desc: "Adopting styles and behaviours of leadership that nurture strong ethical undertones across institutions" 
                   }
                 ].map((item, i) => (
                   <motion.div 
                     key={i} 
                     initial={{ opacity: 0, scale: 0.8 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="space-y-6 flex flex-col items-center group"
                   >
                     <div className="w-20 h-20 mx-auto rounded-full border-2 border-primary/30 flex items-center justify-center bg-[#001a3d] group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(var(--primary),0.2)] transition-all duration-500">
                       <item.icon className="w-10 h-10 text-primary group-hover:scale-110 transition-transform" />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-sm font-black uppercase tracking-widest text-primary">{item.title}</h4>
                        <p className="text-[11px] leading-relaxed text-white/60 font-bold opacity-80 max-w-[180px] mx-auto">
                          {item.desc}
                        </p>
                     </div>
                   </motion.div>
                 ))}
              </div>
           </div>
           
           {/* Connecting Line Decoration */}
           <div className="absolute top-20 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent hidden md:block" />
        </div>

        {/* Distinguished Speaker Section */}
        {event.speaker_name && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-[#001a3d] to-[#00122e] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-14 border border-primary/20 overflow-hidden shadow-2xl"
          >
             {/* Decorative Background */}
             <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
             
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-7 md:gap-12">
                <div className="relative shrink-0">
                   <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
                   <div className="w-36 h-36 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full p-2 bg-gradient-to-tr from-primary via-primary/50 to-primary/20 shadow-2xl relative z-10">
                      <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#00122e] bg-[#001a3d] flex items-center justify-center">
                         <img 
                            src={event.speaker_image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800"} 
                            alt={event.speaker_name} 
                            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 hover:scale-110"
                         />
                      </div>
                   </div>
                   {/* Floating Badge */}
                   <div className="absolute -bottom-4 -right-4 bg-primary text-[#00122e] px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-xl border-4 border-[#00122e] z-20">
                      Guest Speaker
                   </div>
                </div>

                <div className="flex-1 space-y-6 text-center md:text-left">
                   <div className="space-y-2">
                      <div className="flex items-center gap-3 justify-center md:justify-start">
                         <div className="h-[1px] w-8 bg-primary/40" />
                         <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Distinguished Profile</span>
                      </div>
                      <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-none">
                         {event.speaker_name}
                      </h3>
                      <p className="text-lg md:text-xl font-bold text-primary/80 uppercase tracking-widest pl-1">
                         {event.speaker_title || "Strategic Leadership Expert"}
                      </p>
                   </div>

                   <p className="text-base text-white/70 leading-relaxed font-medium italic border-l-4 border-primary/20 pl-6 py-2">
                      {event.speaker_bio || "Expert insights on governance, excellence and strategic leadership frameworks across Africa. Join us for this executive session."}
                   </p>

                   <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-4">
                      <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                         <Award className="w-4 h-4 text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Fellow of RAGLA</span>
                      </div>
                      <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-2">
                         <Globe className="w-4 h-4 text-primary" />
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/60">International Authority</span>
                      </div>
                   </div>
                </div>
             </div>
          </motion.div>
        )}

        {/* Above All / Integrity Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="flex flex-col md:flex-row items-center gap-6 md:gap-10 bg-white/5 p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-white/10"
        >
           <div className="shrink-0 w-16 h-16 sm:w-24 sm:h-24 rounded-full border-4 border-primary/30 flex items-center justify-center bg-primary/10 shadow-2xl animate-pulse">
              <Target className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
           </div>
           <div className="space-y-4">
              <p className="text-lg md:text-xl font-bold leading-relaxed text-white/90">
                 Above all, the programme links ethical integrity to effectiveness of strategic leadership and future governance preparedness, thereby demonstrating that <span className="text-primary italic">integrity is not an encumbrance on performance</span>—but that, it critically enables sustainable leadership, institutional resilience, and enduring validity.
              </p>
           </div>
        </motion.div>

        {/* Why Attend Section */}
        <div className="grid md:grid-cols-[1fr,2fr] gap-6 md:gap-12 items-center">
           <div className="space-y-4">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-lg">
                <ShieldCheck className="w-10 h-10 text-[#00122e]" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-widest text-primary leading-none">Why <br /> Attend?</h3>
           </div>
           <p className="text-base text-white/70 leading-relaxed font-bold italic border-l-2 border-primary/40 pl-8 py-2">
              You must participate in this Programme because the true test of leadership does not stem from how one performs in stable conditions. Instead, leadership is tested by how one decides when the stakes are exceedingly high with real pressures and very unclear ethical direction. This Programme will walk you through how to navigate your way in this instance.
           </p>
        </div>

        {/* Footer CTAs (Buttons from Flyer) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
           {[
             { icon: LayoutDashboard, tag: "#SECURE YOUR SEAT", text: "Register today and secure your place in this exclusive executive learning experience." },
             { icon: TrendingUp, tag: "#ENHANCE YOUR LEADERSHIP", text: "Gain the insights, tools and confidence to lead ethically and decisively." },
             { icon: ShieldCheck, tag: "#PROTECT YOUR LEGACY", text: "Uphold your values, strengthen your institution, and build a legacy that endures." }
           ].map((btn, i) => (
             <div key={i} className="flex gap-5 p-6 rounded-2xl bg-[#001a3d] border border-primary/20 hover:border-primary transition-colors group">
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-[#00122e] transition-all">
                   <btn.icon className="w-6 h-6 text-primary group-hover:text-[#00122e]" />
                </div>
                <div className="space-y-1">
                   <h5 className="text-[10px] font-black uppercase tracking-widest text-primary">{btn.tag}</h5>
                   <p className="text-[10px] font-bold text-white/60 leading-tight">{btn.text}</p>
                </div>
             </div>
           ))}
        </div>
      </div>

      {/* Bottom Horizontal Bar - Final CTA */}
      <div className="bg-primary p-6 sm:p-8 md:p-14 text-[#00122e]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-10">
             <div className="space-y-4 text-center md:text-left">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">Reserved Programme</h4>
                <p className="text-3xl font-black uppercase tracking-widest leading-none">Participation is Free</p>
                <p className="text-sm font-bold opacity-80 max-w-md">Official participation in the Royal Academy executive series is fully funded for selected participants.</p>
                <div className="pt-4 flex flex-wrap gap-6 justify-center md:justify-start">
                   <Button 
                      onClick={() => setIsDialogOpen(true)}
                      className="h-16 px-10 bg-[#00122e] text-primary hover:bg-[#00122e]/90 font-black uppercase tracking-[0.2em] rounded-2xl transition-all shadow-2xl group shadow-black/40 border border-primary/20"
                   >
                      Register Now
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                   </Button>
                </div>
             </div>
             <div className="flex flex-col items-center gap-4 text-center md:text-right md:items-end">
                <div className="font-black text-[#00122e] text-right space-y-1 mb-2 hidden md:block">
                   <p className="text-sm tracking-widest opacity-80 uppercase italic">Official Website</p>
                   <p className="text-xl">WWW.RAGLA.ORG</p>
                </div>
                <div className="w-24 h-24 bg-white p-2 rounded-2xl shadow-xl">
                   <div className="w-full h-full border-2 border-[#00122e] rounded-xl flex items-center justify-center p-1">
                      <QrCode className="w-full h-full text-[#00122e]" />
                   </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#00122e]">Scan to Register</p>
             </div>
          </div>
       </div>
    </div>

    {/* Registration Dialog */}
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:w-auto max-w-2xl bg-background border-primary/20 p-0 overflow-hidden rounded-[1.5rem] sm:rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] border border-white/5">
        <div className="bg-primary p-5 sm:p-8 text-[#00122e] relative overflow-hidden">
           <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl pointer-events-none" />
           <div className="relative z-10">
              <DialogHeader>
                 <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[#00122e]/60 mb-1">Official Registration</p>
                 <DialogTitle className="text-xl sm:text-3xl font-black uppercase tracking-widest flex items-center gap-2 sm:gap-4">
                    <Award className="w-7 h-7 sm:w-10 sm:h-10 shrink-0" />
                    Executive Access
                 </DialogTitle>
              </DialogHeader>
           </div>
        </div>
        <div className="p-4 sm:p-6 md:p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
           <div className="mb-6 sm:mb-10 space-y-2 sm:space-y-3 p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-secondary/30 border border-border/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary opacity-60">Reserved Programme</p>
              <h4 className="text-base sm:text-xl font-black leading-tight">{event.title}</h4>
              <div className="flex items-center gap-2 pt-1 text-xs font-bold text-muted-foreground">
                 <Mail className="w-3.5 h-3.5 text-primary shrink-0" />
                 <span className="truncate">{email}</span>
              </div>
           </div>
           
           <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
             <EventRegistrationForm 
                eventId={event.id}
                fields={formFields}
                eventTitle={event.title}
                eventDate={event.date}
                eventLocation={event.location}
                initialData={{
                   "Email": email,
                   "Email Address": email,
                   "email": email,
                   "Official Email": email,
                   "Your Email": email
                }}
                onSuccess={() => {
                  setTimeout(() => setIsDialogOpen(false), 3000);
                }}
             />
           </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
  );
};

export default EventExecutiveSummary;
