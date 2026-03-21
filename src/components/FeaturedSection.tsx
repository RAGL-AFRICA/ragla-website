import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

type EventType = {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
};

const FeaturedSection = () => {
  const [featuredEvent, setFeaturedEvent] = useState<EventType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvent = async () => {
      try {
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (error) throw error;
        setFeaturedEvent(data);
      } catch (error) {
        console.error("Error fetching featured event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedEvent();
  }, []);

  if (loading || !featuredEvent) {
    // Return empty section smoothly if no featured event or still loading
    return null;
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Featured Image/Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-xl overflow-hidden min-h-96 flex items-center justify-center relative shadow-xl"
            style={{ 
              background: featuredEvent.image_url ? `url(${featuredEvent.image_url}) center/cover no-repeat` : '',
              backgroundColor: featuredEvent.image_url ? 'transparent' : 'hsl(var(--primary) / 0.1)'
            }}
          >
            {/* Dark overlay if image exists to make text (if any) readable, or just for styling */}
            {featuredEvent.image_url && <div className="absolute inset-0 bg-black/20" />}
            
            {!featuredEvent.image_url && (
              <div className="text-center z-10">
                <Star className="w-20 h-20 text-primary mx-auto mb-4" />
                <p className="text-primary font-bold">Featured Highlight</p>
              </div>
            )}
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-primary text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 fill-primary" />
              Featured Highlight
            </p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight">
              {featuredEvent.title}
            </h3>
            
            {featuredEvent.description && (
              <p className="text-muted-foreground leading-relaxed mb-8">
                {featuredEvent.description}
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 px-8 rounded-lg font-semibold hover:brightness-110 transition-all duration-200 uppercase tracking-wider text-sm w-full sm:w-auto"
              >
                View Gallery
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/about-us"
                className="inline-flex items-center justify-center gap-2 border border-primary text-primary py-3 px-8 rounded-lg font-semibold hover:bg-primary hover:text-primary-foreground transition-all duration-200 uppercase tracking-wider text-sm w-full sm:w-auto"
              >
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedSection;
