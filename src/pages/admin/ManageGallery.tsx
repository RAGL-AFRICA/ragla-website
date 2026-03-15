import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trash2, Image as ImageIcon, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type GalleryImage = {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  created_at: string;
};

const ManageGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImage, setNewImage] = useState({ title: '', image_url: '' });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch gallery images: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newImage.image_url) {
        toast.error("Image URL is required");
        return;
      }

      const { error } = await supabase
        .from("gallery_images")
        .insert([newImage]);

      if (error) throw error;

      toast.success("Image added to gallery!");
      setIsDialogOpen(false);
      setNewImage({ title: '', image_url: '' });
      fetchImages();
    } catch (error: any) {
      toast.error("Failed to add image: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Image deleted successfully");
      setImages(images.filter(img => img.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete image: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Gallery</h1>
          <p className="text-muted-foreground mt-2">
            Add or remove images from the public gallery section.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <ImageIcon className="w-4 h-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Gallery Image</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title / Description (Optional)</Label>
                <Input 
                  id="title"
                  placeholder="e.g., Annual Summit 2026" 
                  value={newImage.title}
                  onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input 
                  id="image_url"
                  placeholder="https://example.com/image.jpg" 
                  value={newImage.image_url}
                  onChange={(e) => setNewImage({...newImage, image_url: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Save Image</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4].map(n => <div key={n} className="bg-muted rounded-xl aspect-[3/2]"></div>)}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No images found</h3>
          <p className="text-muted-foreground">Add your first image to populate the gallery.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image) => (
            <div key={image.id} className="group relative rounded-xl overflow-hidden aspect-[3/2] border border-border shadow-sm">
              <img 
                src={image.image_url} 
                alt={image.title || "Gallery image"} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                <div className="flex justify-end gap-2">
                  <a 
                    href={image.image_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-2 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                    title="Open original"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => handleDelete(image.id)}
                    className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {image.title && (
                  <p className="text-white font-medium truncate text-sm bg-black/40 p-2 rounded backdrop-blur-sm">
                    {image.title}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
