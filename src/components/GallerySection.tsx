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
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

      // If we have folders, set the first one as active and fetch its images
      if (fetchedFolders.length > 0) {
        setActiveFolderId(fetchedFolders[0].id);
        await fetchImagesForFolder(fetchedFolders[0].id);
      } else {
        // Fallback: fetch any images that might not be in a folder (legacy)
        const { data: imageData, error: imageError } = await supabase
          .from("gallery_images")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);
          
        if (imageError) throw imageError;
        setImages(imageData || []);
      }
    } catch (error) {
      console.error("Error fetching gallery data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchImagesForFolder = async (folderId: string) => {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq('folder_id', folderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error("Error fetching images for folder:", error);
    }
  };

  const handleFolderClick = async (folderId: string) => {
    setActiveFolderId(folderId);
    await fetchImagesForFolder(folderId);
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
                className="rounded-xl overflow-hidden aspect-[3/2] group relative bg-background/20"
              >
                <img
                  src={img.image_url}
                  alt={img.title || `Gallery image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {img.title && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <p className="text-white text-center font-medium drop-shadow-md text-sm">
                      {img.title}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default GallerySection;
