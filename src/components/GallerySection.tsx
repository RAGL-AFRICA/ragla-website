import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon, FolderOpen } from "lucide-react";

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
        .limit(24);

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
          <div className="flex flex-wrap justify-center gap-3 mb-10">
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {images.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.05 }}
                className="rounded-xl overflow-hidden aspect-[3/2] group relative bg-background/20 cursor-pointer"
                onMouseEnter={() => setExpandedImg(img)}
                onMouseLeave={() => setExpandedImg(null)}
                onClick={() => setExpandedImg(expandedImg?.id === img.id ? null : img)}
              >
                <img
                  src={img.image_url}
                  alt={img.title || `Gallery image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
            ))}
          </div>

          {/* Quarter-screen hover/click expand overlay */}
          {expandedImg && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="w-[50vw] h-[50vh] rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-auto"
                onMouseLeave={() => setExpandedImg(null)}
                onClick={() => setExpandedImg(null)}
              >
                <img
                  src={expandedImg.image_url}
                  alt={expandedImg.title || "Gallery image"}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        )}
      </div>
    </section>
  );
};

export default GallerySection;
