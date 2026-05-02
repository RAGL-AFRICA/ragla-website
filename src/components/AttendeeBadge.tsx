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
    const duration = 2 * 1000;
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
      const dataUrl = await toPng(badgeRef.current, { 
        cacheBust: true, 
        quality: 1,
        pixelRatio: 2 // Better quality
      });
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
    try {
      if (badgeRef.current === null) return;
      
      // Try to prepare the file for sharing if the browser supports it
      let filesToShare: File[] = [];
      try {
        const dataUrl = await toPng(badgeRef.current, { pixelRatio: 2 });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        filesToShare = [new File([blob], 'ragla-badge.png', { type: 'image/png' })];
      } catch (err) {
        console.error("Could not prepare file for sharing", err);
      }

      if (navigator.share && navigator.canShare && navigator.canShare({ files: filesToShare })) {
        await navigator.share({
          title: 'I am attending ' + eventTitle,
          text: shareText,
          url: shareUrl,
          files: filesToShare
        });
      } else if (navigator.share) {
        await navigator.share({
          title: 'I am attending ' + eventTitle,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback for desktop: WhatsApp is very common
        window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, '_blank');
      }
    } catch (err) {
      console.log('Error sharing', err);
      // Final fallback to Twitter
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 md:space-y-8 w-full overflow-hidden px-1 py-4 md:py-8">
      {/* Premium Success Header */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2 md:space-y-3"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-green-500 blur-2xl opacity-20 animate-pulse"></div>
          <div className="relative inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="w-6 h-6 md:w-10 md:h-10 text-green-500" />
          </div>
        </div>
        <div className="space-y-1">
          <h3 className="text-xl md:text-3xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-foreground bg-[length:200%_auto] animate-shimmer leading-tight uppercase">
            Pass Generated
          </h3>
          <p className="text-[10px] md:text-sm text-muted-foreground font-medium flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-primary" />
            Your exclusive digital access is ready
          </p>
        </div>
      </motion.div>

      {/* The Holographic Badge Card */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="perspective-1000 w-full max-w-[400px] px-2"
      >
        <div 
          ref={badgeRef}
          className="relative aspect-[1.58/1] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0a0a0b] text-white p-4 sm:p-6 group transition-all duration-700"
        >
          {/* Holographic Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.05] via-transparent to-white/[0.05] pointer-events-none z-10"></div>
          <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent skew-x-[-25deg] group-hover:left-[150%] transition-all duration-[1500ms] ease-in-out"></div>
          
          {/* Card Content Layout */}
          <div className="relative h-full flex flex-col justify-between z-20">
            {/* Top Bar */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center border border-white/20">
                   <User className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 text-white" />
                </div>
                <div className="space-y-0 min-w-0">
                  <span className="text-[6px] sm:text-[7px] uppercase tracking-[0.3em] font-black text-primary opacity-90">OFFICIAL PASS</span>
                  <div className="text-[10px] sm:text-sm md:text-base font-black tracking-tight leading-none truncate max-w-[100px] sm:max-w-[150px]">{attendeeName}</div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <img src="/lovable-uploads/87965355-6b5c-439d-b4b6-ebf29910e599.png" alt="RAGLA" className="h-5 sm:h-7 invert brightness-0 opacity-100" />
                <span className="text-[5px] sm:text-[6px] uppercase tracking-widest block opacity-70 mt-0.5 font-bold">RAGL AFRICA</span>
              </div>
            </div>

            {/* Middle Main Text */}
            <div className="space-y-0.5 sm:space-y-1">
               <div className="inline-flex flex-col">
                 <h4 className="text-base sm:text-xl md:text-2xl font-black italic tracking-tighter leading-none">
                   I WILL BE <span className="text-primary not-italic">ATTENDING</span>
                 </h4>
               </div>
               <h5 className="text-[10px] sm:text-sm md:text-base font-bold opacity-100 line-clamp-1 max-w-[90%]">{eventTitle}</h5>
            </div>

            {/* Bottom Bar Details */}
            <div className="flex items-end justify-between pt-2 sm:pt-3 border-t border-white/10 mt-auto">
              <div className="flex gap-3 sm:gap-5">
                 <div className="space-y-0">
                   <div className="flex items-center gap-1 opacity-60">
                     <Calendar className="w-2 h-2 text-primary" />
                     <span className="text-[5px] uppercase font-black tracking-widest leading-none">Date</span>
                   </div>
                   <span className="text-[8px] sm:text-[10px] font-bold block leading-none">{eventDate ? new Date(eventDate).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric'}) : 'TBA'}</span>
                 </div>
                 
                 {eventLocation && (
                   <div className="space-y-0">
                     <div className="flex items-center gap-1 opacity-60">
                       <MapPin className="w-2 h-2 text-primary" />
                       <span className="text-[5px] uppercase font-black tracking-widest leading-none">Location</span>
                     </div>
                     <span className="text-[8px] sm:text-[10px] font-bold block leading-none truncate max-w-[60px] sm:max-w-[100px]">{eventLocation}</span>
                   </div>
                 )}
              </div>
              
              <div className="flex flex-col items-end gap-1">
                <div className="p-0.5 bg-white rounded-sm">
                   <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
                </div>
                <div className="text-[4px] font-mono opacity-50 tracking-tighter leading-none uppercase">ID: {eventId.substring(0,6)}</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Share Actions */}
      <div className="w-full max-w-[400px] px-2 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="secondary"
            className="rounded-xl h-12 font-black uppercase tracking-widest border border-white/5 shadow-xl flex-1 text-[10px]"
            onClick={downloadBadge}
          >
            <Download className="w-4 h-4 mr-2 text-primary" />
            Download Ticket
          </Button>
          <Button 
            className="rounded-xl h-12 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl flex-1 text-[10px]"
            onClick={handleShareSystem}
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Pass
          </Button>
        </div>
        
        <div className="flex flex-col items-center pt-1 space-y-3">
           <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground opacity-60">Instant Social Share</p>
           <div className="flex gap-2">
              <button 
                onClick={() => window.open(`https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`, '_blank')}
                className="w-9 h-9 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                title="Share on WhatsApp"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.316 1.592 5.448 0 9.886-4.438 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.438-9.889 9.886 0 2.225.6 4.025 1.709 5.881l-1.087 3.97 4.093-1.077zm11.334-7.464c-.287-.143-1.697-.838-1.959-.933-.261-.095-.452-.143-.642.143-.19.285-.733.931-.899 1.121-.166.19-.333.213-.62.072-.286-.144-1.21-.447-2.305-1.423-.852-.76-1.427-1.7-1.594-1.986-.166-.285-.018-.44.126-.581.129-.126.286-.333.429-.5.143-.166.19-.285.286-.475.095-.19.048-.356-.024-.5-.071-.143-.642-1.545-.88-2.116-.231-.558-.466-.482-.642-.491-.166-.008-.356-.01-.546-.01s-.5.071-.76.356c-.261.285-1 0-1 2.446s1.284 4.8 1.451 5.038c.166.237 2.527 3.859 6.121 5.412.854.369 1.521.589 2.041.754.858.271 1.639.233 2.259.141.69-.103 2.115-.863 2.413-1.697.298-.834.298-1.545.21-1.693-.089-.143-.328-.218-.615-.356z"/>
                </svg>
              </button>
              <button 
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
                className="w-9 h-9 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all shadow-sm"
                title="Share on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
                className="w-9 h-9 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-[#1877f2] hover:text-white transition-all shadow-sm"
                title="Share on Facebook"
              >
                <Facebook className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')}
                className="w-9 h-9 rounded-xl bg-secondary/50 border border-border flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                title="Share on X"
              >
                <Twitter className="w-4 h-4" />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AttendeeBadge;
