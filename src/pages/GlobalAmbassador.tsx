import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Award, 
  ShieldCheck, 
  Leaf, 
  Users, 
  Globe, 
  GraduationCap, 
  ChevronLeft, 
  Share2, 
  Quote, 
  Check, 
  Linkedin, 
  Facebook, 
  Twitter, 
  MessageSquare, 
  Link2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const partnershipCommitments = [
  {
    title: "Transformational Leadership",
    description: "Fostering visionary leadership capable of inspiring change and driving meaningful reforms across sectors.",
    icon: Award
  },
  {
    title: "Ethical Governance",
    description: "Promoting values-based governance, transparency, and high standards of integrity in public and private institutions.",
    icon: ShieldCheck
  },
  {
    title: "Sustainability and Climate Responsibility",
    description: "Championing sustainable development, environmental stewardship, and green leadership initiatives globally.",
    icon: Leaf
  },
  {
    title: "Women and Youth Empowerment",
    description: "Creating pathways for women and youth to develop critical leadership skills, voice, and opportunities.",
    icon: Users
  },
  {
    title: "Global Collaboration and Knowledge Exchange",
    description: "Fostering robust international dialogue, sharing best practices, and building bridges across continents.",
    icon: Globe
  },
  {
    title: "Capacity Building for Future Leaders",
    description: "Nurturing the next generation of principled African leaders through comprehensive education and mentorship.",
    icon: GraduationCap
  }
];

const GlobalAmbassador = () => {
  const shareUrl = window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const pageTitle = "Amb. (Dr.) Smily Mukta Ghoshal - Strategic Partner & Global Ambassador | RAGLA";
  const shareText = `We are delighted to welcome Amb. (Dr.) Smily Mukta Ghoshal as our Strategic Partner & Global Ambassador at the Royal Academy of Governance and Leadership Africa (RAGLA).`;
  const encodedTitle = encodeURIComponent(shareText);

  const shareLinks = [
    {
      name: "LinkedIn",
      icon: <Linkedin className="w-4 h-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: "hover:bg-[#0077b5] hover:text-white"
    },
    {
      name: "Facebook",
      icon: <Facebook className="w-4 h-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: "hover:bg-[#1877f2] hover:text-white"
    },
    {
      name: "WhatsApp",
      icon: <MessageSquare className="w-4 h-4" />,
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: "hover:bg-[#25d366] hover:text-white"
    },
    {
      name: "X (Twitter)",
      icon: <Twitter className="w-4 h-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: "hover:bg-black hover:text-white"
    }
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Profile link copied to clipboard!");
  };

  const handleShare = (linkUrl: string) => {
    window.open(linkUrl, "_blank", "noopener,noreferrer");
  };

  const ogImageUrl = window.location.origin + "/smily-mukta-ghoshal.jpg";

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-[#00122e]">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content="Amb. (Dr.) Smily Mukta Ghoshal is a strategic partner and global ambassador for RAGLA, recognized for sustainability, women empowerment, and leadership." />
        <meta property="og:title" content="Amb. (Dr.) Smily Mukta Ghoshal - RAGLA Strategic Partner & Global Ambassador" />
        <meta property="og:description" content="Learn more about the partnership between RAGLA and Dr. Smily Mukta Ghoshal advancing innovative leadership solutions globally." />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="profile" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Amb. (Dr.) Smily Mukta Ghoshal - Strategic Partner & Global Ambassador" />
        <meta name="twitter:image" content={ogImageUrl} />
      </Helmet>

      <Header />

      <main className="pb-20 pt-8">
        
        {/* Back Button */}
        <div className="container-main mb-6">
          <Button variant="ghost" asChild className="-ml-3 text-muted-foreground hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest">
            <Link to="/">
              <ChevronLeft className="w-3.5 h-3.5 mr-1" />
              Back to Home
            </Link>
          </Button>
        </div>

        {/* Hero Welcome Announcement Card */}
        <div className="container-main">
          <div className="relative overflow-hidden bg-[#00122e] rounded-[2rem] sm:rounded-[3rem] border border-primary/20 shadow-[0_40px_100px_-15px_rgba(0,0,0,0.6)] text-white mb-16">
            
            {/* Background design elements */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
            
            <div className="p-8 sm:p-12 md:p-16 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Text Area */}
              <div className="lg:col-span-7 space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-[2px] w-12 bg-primary" />
                    <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Strategic Partnership</p>
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase leading-[1.05]">
                    Royal Academy <br />
                    <span className="text-primary">Welcomes</span>
                  </h1>
                </div>

                <div className="space-y-2 border-l-4 border-primary pl-6 py-2">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight uppercase leading-none">
                    Amb. (Dr.) Smily Mukta Ghoshal
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-primary uppercase tracking-widest">
                    Strategic Partner & Global Ambassador
                  </p>
                </div>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed font-medium">
                  The Royal Academy of Governance and Leadership Africa is honoured to welcome Ambassador (Dr.) Smily Mukta Ghoshal as a Strategic Partner and Global Ambassador to advance innovative leadership solutions and promote governance excellence globally.
                </p>

                {/* Social Share Ribbon */}
                <div className="pt-4 flex flex-wrap items-center gap-3 border-t border-white/5">
                  <span className="text-xs font-bold text-white/50 uppercase tracking-wider flex items-center gap-2">
                    <Share2 className="w-3.5 h-3.5 text-primary" />
                    Share Announcement:
                  </span>
                  <div className="flex items-center gap-2">
                    {shareLinks.map((link) => (
                      <Tooltip key={link.name}>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className={`w-9 h-9 rounded-full bg-white/5 border-white/10 text-white/80 transition-colors ${link.color}`}
                            onClick={() => handleShare(link.url)}
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
                          className="w-9 h-9 rounded-full bg-white/5 border-white/10 text-white/80 hover:bg-primary hover:text-[#00122e] transition-colors"
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
                </div>
              </div>

              {/* Photo Area */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-[340px] aspect-[4/5]">
                  {/* Decorative Frame */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/35 via-transparent to-primary/10 rounded-[2.5rem] blur-sm -m-3 pointer-events-none" />
                  <div className="absolute -top-3 -left-3 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-[2rem] pointer-events-none" />
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-[2rem] pointer-events-none" />
                  
                  <div className="w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-[#001a3d] p-3 shadow-2xl relative z-10">
                    <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                      <img
                        src="/smily-mukta-ghoshal.jpg"
                        alt="Ambassador (Dr.) Smily Mukta Ghoshal"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Executive Profile Section */}
        <section className="section-padding bg-secondary/20">
          <div className="container-main">
            <div className="max-w-4xl mx-auto space-y-12">
              <div className="space-y-4 text-center">
                <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Credentials & Impact</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  Executive Profile
                </h2>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 text-white/80 font-medium text-base leading-relaxed">
                <div className="space-y-6">
                  <p>
                    <strong className="text-white">Ambassador (Dr.) Smily Mukta Ghoshal</strong> is an internationally renowned leadership mentor, environmental sustainability advocate, entrepreneur, motivational speaker, transformational coach, and humanitarian leader.
                  </p>
                  <p>
                    She is the Founder and CEO of <strong className="text-primary italic">#1 Natural Beauty Organic Skin & Hair Products, USA</strong>, and is globally recognized for her dedication to sustainability, women empowerment, youth development, leadership excellence, and social impact initiatives.
                  </p>
                </div>
                <div className="space-y-6">
                  <p>
                    Recognized globally as the <strong className="text-primary">"Green Queen"</strong> and a respected advocate for sustainable development, Dr. Ghoshal has inspired individuals and communities across continents through her extensive work in leadership development, environmental stewardship, entrepreneurship, and humanitarian service.
                  </p>
                  <div className="p-5 rounded-2xl bg-[#00122e]/60 border border-primary/10 space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-primary">Core Distinctions</h4>
                    <ul className="grid grid-cols-2 gap-2 text-xs text-white/90">
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" /> Green Queen</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" /> Sustainability Advocate</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" /> Entrepreneur (USA)</li>
                      <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-primary shrink-0" /> Transformational Coach</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Statement & Pillars */}
        <section className="section-padding">
          <div className="container-main">
            <div className="max-w-5xl mx-auto space-y-16">
              
              <div className="text-center space-y-4">
                <div className="inline-block px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
                  <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">Strategic Collaboration</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
                  Partnership Statement
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto font-medium">
                  The partnership between RAGLA and Amb. (Dr.) Smily Mukta Ghoshal is a reflection of a shared commitment to building capacity and promoting excellence.
                </p>
              </div>

              {/* Pillars Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {partnershipCommitments.map((pillar, i) => {
                  const Icon = pillar.icon;
                  return (
                    <motion.div
                      key={pillar.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="p-6 rounded-2xl bg-[#00122e] border border-primary/10 hover:border-primary/30 transition-all duration-300 group hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-[#00122e] transition-all duration-500 mb-6">
                        <Icon className="w-6 h-6 text-primary group-hover:text-[#00122e]" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-sm text-white/60 leading-relaxed font-medium">
                        {pillar.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* Partnership Summary Card */}
              <div className="p-6 sm:p-10 rounded-[2rem] bg-white/5 border border-white/10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                <p className="text-base sm:text-lg text-white/80 leading-relaxed font-medium italic max-w-3xl mx-auto">
                  "This Strategic Partnership looks forward to advancing innovative leadership solutions and promoting governance excellence across Africa and the larger global community."
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Message from Royal Academy */}
        <section className="section-padding bg-secondary/20 border-t border-border">
          <div className="container-main">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative bg-gradient-to-br from-[#001a3d] to-[#00122e] rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 border border-primary/20 overflow-hidden shadow-2xl text-center space-y-8"
              >
                {/* Background decorative */}
                <div className="absolute -top-12 -left-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="flex justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30">
                    <Quote className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Royal Academy Message</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    Delighted to Partner
                  </h3>
                </div>

                <p className="text-lg sm:text-xl md:text-2xl font-bold text-white/95 italic leading-relaxed max-w-3xl mx-auto">
                  "We are delighted to partner with a globally respected thought leader whose vision, values, and commitment to sustainable impact strongly align with our mission of developing principled leaders and strengthening governance institutions across Africa and beyond."
                </p>

                <div className="pt-4 flex flex-col items-center">
                  <div className="h-[2px] w-20 bg-primary/50 mb-4" />
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-primary">Royal Academy Secretariat</p>
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">
                    Royal Academy of Governance and Leadership Africa
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default GlobalAmbassador;
