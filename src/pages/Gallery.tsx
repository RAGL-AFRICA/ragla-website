import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon } from "lucide-react";

type GalleryImage = {
  id: string;
  title: string | null;
  image_url: string;
  created_at: string;
};

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("gallery_images")
          .select("id, title, image_url, created_at")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setImages(data || []);
      } catch (error) {
        console.error("Error loading gallery images", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="section-padding bg-secondary">
        <div className="container-main text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground mt-3">
            Published photos uploaded from the admin panel.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-main">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="rounded-xl bg-muted aspect-square" />
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium text-foreground">No published images yet</h3>
              <p className="text-muted-foreground">Uploaded gallery photos will appear here automatically.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={img.id} className="rounded-xl overflow-hidden card-shadow aspect-square group relative">
                  <img
                    src={img.image_url}
                    alt={img.title || `Gallery image ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {img.title && (
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs px-3 py-2 truncate">
                      {img.title}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Gallery;
