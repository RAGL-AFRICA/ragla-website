import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon } from "lucide-react";

type GalleryImage = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
};

const GallerySection = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error("Error fetching gallery images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
     return (
        <section id="gallery" className="section-padding bg-dark-surface min-h-[400px] flex justify-center items-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </section>
     );
  }

  if (images.length === 0) {
    return null; // Don't show the gallery section if empty
  }

  return (
    <section id="gallery" className="section-padding bg-dark-surface">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recent Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Glimpses into our community events, achievements, and milestones.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
              className="rounded-xl overflow-hidden aspect-[3/2] group relative"
            >
              <img
                src={img.image_url}
                alt={img.title || `Gallery image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {img.title && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                  <p className="text-white text-center font-medium drop-shadow-md">
                    {img.title}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
