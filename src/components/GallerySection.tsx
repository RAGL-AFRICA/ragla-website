import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, FolderOpen, X } from "lucide-react";

type GalleryFolder = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

type GalleryImage = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  folder_id: string | null;
};

const GallerySection = () => {
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [expandedImg, setExpandedImg] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch folders
      const { data: folderData, error: folderError } = await supabase
        .from("gallery_folders")
        .select("*")
        .order("created_at", { ascending: false });

      if (folderError) throw folderError;
      
      const fetchedFolders = folderData || [];
      setFolders(fetchedFolders);

      await fetchImages();
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (folderId?: string) => {
    try {
      let query = supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);

      if (folderId) {
        query = query.eq("folder_id", folderId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images for folder:", error);
    }
  };

  const handleFolderClick = async (folderId: string) => {
    setActiveFolderId(folderId);
    if (folderId === "all") {
      await fetchImages();
      return;
    }

    await fetchImages(folderId);
  };

  if (loading) {
     return (
        <section id="gallery" className="section-padding bg-dark-surface min-h-[400px] flex justify-center items-center">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </section>
     );
  }

  if (folders.length === 0 && images.length === 0) {
    return null; // Hide if completely empty
  }

  // Find active folder details
  const activeFolder = folders.find(f => f.id === activeFolderId);

  return (
    <section id="gallery" className="section-padding bg-dark-surface">
      <div className="container-main">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recent Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Glimpses into our community events, achievements, and milestones.
          </p>
        </motion.div>

        {/* Folder navigation (Tabs) */}
        {folders.length > 0 && (
          <div className="flex gap-2 mb-10 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center">
            <button
              onClick={() => handleFolderClick("all")}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                activeFolderId === "all"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-background/50 text-foreground hover:bg-background border border-border"
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              All Photos
            </button>
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => handleFolderClick(folder.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                  activeFolderId === folder.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "bg-background/50 text-foreground hover:bg-background border border-border"
                }`}
              >
                <FolderOpen className="w-4 h-4" />
                {folder.name}
              </button>
            ))}
          </div>
        )}

        {/* Active Folder Info */}
        {activeFolder && activeFolder.description && (
          <div className="text-center mb-8 max-w-3xl mx-auto">
             <p className="text-muted-foreground italic">"{activeFolder.description}"</p>
          </div>
        )}

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
             <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
             <p>No photos have been uploaded to this album yet.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 md:gap-4 md:auto-rows-[220px]">
              {images.slice(0, 7).map((img, i) => {
                // Dynamic Mosaic Grid Logic for 7 images (HCI: Aesthetic & Rhythm)
                let spanClasses = "col-span-1 row-span-1";
                if (i === 0) spanClasses = "col-span-2 row-span-2"; // Feature large image
                else if (i === 3) spanClasses = "col-span-1 row-span-2 hidden md:block"; // Tall image (hide on small screens to preserve flow)
                else if (i === 5) spanClasses = "col-span-2 row-span-1"; // Wide image

                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className={`rounded-xl overflow-hidden group relative bg-background/20 cursor-pointer ${spanClasses}`}
                    onClick={() => setExpandedImg(img)}
                  >
                    <img
                      src={img.image_url}
                      alt={`Gallery image ${i + 1}`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 select-none"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                    
                    {/* Hover Info Overlay (HCI: Feedback & Context) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
                      <h3 className="text-white font-bold text-lg md:text-xl leading-tight mb-1 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                        {activeFolder?.name ? `${activeFolder.name} Highlight` : "Gallery Moment"}
                      </h3>
                      <p className="text-white/80 text-sm md:text-base line-clamp-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 ease-out delay-75">
                        {img.description || "Click to view full size"}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Full-screen click expand overlay */}
            <AnimatePresence>
              {expandedImg && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
                  onClick={() => setExpandedImg(null)}
                >
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute top-4 right-4 md:top-8 md:right-8 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedImg(null);
                    }}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="relative w-[95vw] h-[95vh] flex items-center justify-center pointer-events-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={expandedImg.image_url}
                      alt={expandedImg.title || "RAGLA Gallery Image"}
                      className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.5)] select-none pointer-events-auto"
                      onContextMenu={(e) => e.preventDefault()}
                      onDragStart={(e) => e.preventDefault()}
                    />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Call to Action - View Full Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-16 text-center"
            >
              <Link
                to="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 px-10 rounded-full font-bold shadow-lg shadow-primary/20 hover:-translate-y-1 hover:shadow-primary/40 focus:outline-none focus:ring-4 focus:ring-primary/30 transition-all duration-300 uppercase tracking-wider text-sm relative overflow-hidden group"
                aria-label="View all photos in the full gallery page"
              >
                <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  View Full Gallery
                </span>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
