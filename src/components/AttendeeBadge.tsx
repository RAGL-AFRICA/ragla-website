import { Calendar, MapPin, Share2, Download, User, CheckCircle2, Ticket, QrCode } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRef, useEffect } from "react";
import { Facebook, Linkedin, Twitter, Sparkles } from "lucide-react";
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from "framer-motion";

interface AttendeeBadgeProps {
  attendeeName: string;
  eventTitle: string;
  eventDate: string | null;
  eventLocation: string | null;
  eventId: string;
}

const AttendeeBadge = ({ attendeeName, eventTitle, eventDate, eventLocation, eventId }: AttendeeBadgeProps) => {
  const badgeRef = useRef<HTMLDivElement>(null);
  const shareUrl = `${window.location.origin}/events/${eventId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const shareText = `I'm excited to announce that I'll be attending "${eventTitle}"! Join me and other leaders for this exclusive RAGLA event.`;
  const encodedText = encodeURIComponent(shareText);

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const downloadBadge = async () => {
    if (badgeRef.current === null) return;
    
    try {
      toast.loading("Generating your premium badge...");
      const dataUrl = await toPng(badgeRef.current, { cacheBust: true, quality: 1 });
      const link = document.createElement('a');
      link.download = `RAGLA-Badge-${attendeeName.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      toast.dismiss();
      toast.success("Badge downloaded! Show it off on your socials.");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to generate image. Please try a screenshot!");
      console.error(err);
    }
  };

  const handleShareSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I am attending ' + eventTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-10 w-full overflow-hidden px-4 py-8">
      {/* Premium Success Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-3xl md:text-5xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] animate-shimmer">
            WELCOME TO RAGLA
          </h3>
          <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Your exclusive digital pass is ready
            <Sparkles className="w-4 h-4 text-primary" />
          </p>
        </div>
      </motion.div>

      {/* The Holographic Badge Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
        animate={{ opacity: 1, scale: 1, rotateX: 0 }}
        transition={{ type: "spring", damping: 15, stiffness: 100 }}
        className="perspective-1000 w-full max-w-lg"
      >
        <div 
          ref={badgeRef}
          className="relative aspect-[1.58/1] w-full rounded-[2.5rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(var(--primary),0.3)] border border-white/20 bg-[#08080a] text-white p-6 sm:p-10 group transition-all duration-700"
        >
          {/* Holographic Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-white/[0.08] pointer-events-none z-10"></div>
          <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1500ms] ease-in-out"></div>
          
          {/* Animated Background Orbs */}
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px]"></div>
          
          {/* Static grain effect */}
          <div className="absolute inset-x-0 inset-y-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay"></div>

          {/* Card Content Layout */}
          <div className="relative h-full flex flex-col justify-between z-20">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary via-primary/80 to-primary/40 flex items-center justify-center border border-white/20 shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500">
                   <User className="w-6 h-6 text-white" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase tracking-[0.4em] font-black text-primary opacity-90">OFFICIAL PASS</span>
                  <div className="text-xl sm:text-2xl font-black tracking-tight">{attendeeName}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <img src="/lovable-uploads/87965355-6b5c-439d-b4b6-ebf29910e599.png" alt="RAGLA" className="h-10 invert brightness-0 opacity-100 drop-shadow-lg" />
                <span className="text-[7px] uppercase tracking-widest block opacity-70 mt-1 font-bold">EXCELLENCE IN GOVERNANCE</span>
              </div>
            </div>

            {/* Middle Main Text */}
            <div className="space-y-4">
               <div className="inline-flex flex-col">
                 <h4 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter leading-none">
                   I WILL BE <span className="text-primary not-italic">ATTENDING</span>
                 </h4>
                 <div className="h-1.5 w-full bg-gradient-to-r from-primary to-transparent mt-1 rounded-full opacity-50"></div>
               </div>
               <h5 className="text-xl sm:text-3xl font-bold opacity-100 line-clamp-1 max-w-[90%] drop-shadow-md">{eventTitle}</h5>
            </div>

            {/* Bottom Bar Details */}
            <div className="flex items-end justify-between pt-6 border-t border-white/10 mt-auto">
              <div className="flex gap-6 sm:gap-10">
                 <div className="space-y-1">
                   <div className="flex items-center gap-1.5 opacity-60">
                     <Calendar className="w-3 h-3 text-primary" />
                     <span className="text-[8px] uppercase font-black tracking-widest">Date</span>
                   </div>
                   <span className="text-xs sm:text-sm font-bold block">{eventDate ? new Date(eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric'}) : 'TBA'}</span>
                 </div>
                 
                 {eventLocation && (
                   <div className="space-y-1">
                     <div className="flex items-center gap-1.5 opacity-60">
                       <MapPin className="w-3 h-3 text-primary" />
                       <span className="text-[8px] uppercase font-black tracking-widest">Global Location</span>
                     </div>
                     <span className="text-xs sm:text-sm font-bold block truncate max-w-[120px] sm:max-w-[200px]">{eventLocation}</span>
                   </div>
                 )}
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                <div className="p-1 px-1.5 bg-white rounded-md">
                   <QrCode className="w-8 h-8 text-black" />
                </div>
                <div className="text-[7px] font-mono opacity-50 tracking-tighter">ID: RG-{eventId.substring(0,8).toUpperCase()}</div>
              </div>
            </div>
          </div>
          
          {/* Protective Shine Overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
        </div>
      </motion.div>

      {/* Share Actions */}
      <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button 
          variant="secondary"
          className="rounded-2xl h-14 font-black uppercase tracking-widest border border-white/5 shadow-xl hover:bg-secondary/80 transition-all hover:-translate-y-1"
          onClick={downloadBadge}
        >
          <Download className="w-5 h-5 mr-3 text-primary" />
          Download Ticket
        </Button>
        <Button 
          className="rounded-2xl h-14 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:-translate-y-1"
          onClick={handleShareSystem}
        >
          <Share2 className="w-5 h-5 mr-3" />
          Share to Socials
        </Button>
        
        <div className="sm:col-span-2 flex flex-col items-center pt-4 space-y-4">
           <p className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Instant Profile Share</p>
           <div className="flex gap-4">
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
                className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-[#0077b5] hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
              >
                <Linkedin className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
                className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-[#1877f2] hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
              >
                <Facebook className="w-5 h-5" />
              </button>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')}
                className="w-12 h-12 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-black hover:text-white hover:border-transparent transition-all hover:-translate-y-1"
              >
                <Twitter className="w-5 h-5" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeBadge;
