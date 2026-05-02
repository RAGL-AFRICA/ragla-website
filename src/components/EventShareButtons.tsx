import { Facebook, Linkedin, Twitter, MessageSquare, Link2, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface EventShareButtonsProps {
  eventId: string;
  eventTitle: string;
}

const EventShareButtons = ({ eventId, eventTitle }: EventShareButtonsProps) => {
  const shareUrl = `${window.location.origin}/events/${eventId}`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(`Check out this event: ${eventTitle}`);

  const shareLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0077b5] hover:text-white",
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877f2] hover:text-white",
    },
    {
      name: "WhatsApp",
      icon: <MessageSquare className="w-4 h-4" />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-[#25d366] hover:text-white",
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-black hover:text-white",
    },
     {
      name: "Instagram",
      icon: <Instagram className="w-4 h-4" />,
      url: `https://www.instagram.com/`, // Instagram doesn't have a direct sharer like FB/LI for web URLs, usually users share to stories via mobile app
      color: "hover:bg-[#e4405f] hover:text-white",
      onClick: () => {
        toast.info("Instagram sharing is best done by copying the link and pasting in your story or bio!");
      }
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Event link copied to clipboard!");
  };

  const handleShare = (link: typeof shareLinks[0]) => {
    if (link.onClick) {
      link.onClick();
    } else {
      window.open(link.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">Share:</span>
      {shareLinks.map((link) => (
        <Tooltip key={link.name}>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className={`w-9 h-9 rounded-full transition-colors ${link.color}`}
              onClick={() => handleShare(link)}
            >
              {link.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share on {link.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="w-9 h-9 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            onClick={copyToClipboard}
          >
            <Link2 className="w-4 h-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy Link</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export default EventShareButtons;
