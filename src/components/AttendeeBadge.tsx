import { Calendar, MapPin, Share2, Download, User, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { useRef } from "react";
import { Facebook, Linkedin, Twitter, MessageSquare } from "lucide-react";

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

  const handleShareSystem = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'I am attending ' + eventTitle,
          text: shareText,
          url: shareUrl,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      // Fallback
      window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col items-center space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Premium Success Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-2">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h3 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          Registration Confirmed!
        </h3>
        <p className="text-muted-foreground">You are now part of this exclusive leadership event.</p>
      </div>

      {/* The Badge Card */}
      <div 
        ref={badgeRef}
        className="relative w-full max-w-md aspect-[1.6/1] rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-[#0a0a0b] text-white p-8 group transition-all duration-500"
      >
        {/* Decorative elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/30 transition-colors"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px]"></div>
        
        {/* Content */}
        <div className="relative h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary">Official Attendee</span>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/40 flex items-center justify-center border border-white/10">
                   <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold truncate max-w-[200px]">{attendeeName}</span>
              </div>
            </div>
            <div className="text-right">
              <img src="/lovable-uploads/87965355-6b5c-439d-b4b6-ebf29910e599.png" alt="RAGLA" className="h-8 opacity-90 invert brightness-0" 
                onError={(e) => {
                  // Fallback if logo not found
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-[8px] uppercase tracking-widest block opacity-60 mt-1">Regional Academy on Governance & Leadership</span>
            </div>
          </div>

          <div className="space-y-3">
             <h4 className="text-2xl md:text-3xl font-black italic tracking-tight leading-none text-balance">
               I WILL BE <span className="text-primary italic">ATTENDING</span>
             </h4>
             <div className="h-[2px] w-16 bg-primary"></div>
             <h5 className="text-xl font-bold opacity-90 line-clamp-1">{eventTitle}</h5>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 opacity-70">
                 <Calendar className="w-3.5 h-3.5 text-primary" />
                 <span className="text-[10px] uppercase font-bold">
                   {eventDate ? new Date(eventDate).toLocaleDateString() : 'TBA'}
                 </span>
               </div>
               {eventLocation && (
                 <div className="flex items-center gap-1.5 opacity-70">
                   <MapPin className="w-3.5 h-3.5 text-primary" />
                   <span className="text-[10px] uppercase font-bold truncate max-w-[100px]">
                     {eventLocation}
                   </span>
                 </div>
               )}
            </div>
            <div className="text-[8px] font-mono opacity-40">TICKET NO: #RG-{eventId.substring(0,6).toUpperCase()}</div>
          </div>
        </div>
        
        {/* Subtle texture/gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-white/[0.05] pointer-events-none"></div>
      </div>

      {/* Share Actions */}
      <div className="w-full max-w-md space-y-4">
        <p className="text-center text-sm font-medium text-muted-foreground">Share your achievement with your network</p>
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-[#0077b5] hover:bg-[#0077b5]/90 text-white rounded-xl h-11"
            onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
          >
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </Button>
          <Button 
            className="bg-[#1877f2] hover:bg-[#1877f2]/90 text-white rounded-xl h-11"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
          >
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </Button>
          <Button 
            variant="outline" 
            className="rounded-xl h-11 border-primary/20 hover:bg-primary/5 col-span-2"
            onClick={handleShareSystem}
          >
            <Share2 className="w-4 h-4 mr-2 text-primary" />
            Share my Attendance Page
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AttendeeBadge;
