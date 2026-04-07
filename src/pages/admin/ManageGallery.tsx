import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trash2, Image as ImageIcon, ExternalLink, FolderPlus, UploadCloud, FolderOpen, ArrowLeft, Link as LinkIcon } from "lucide-react";
import { generateId } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  created_at: string;
};

const GALLERY_BUCKET_CANDIDATES = ["gallery", "gallery-images", "images"];

const ManageGallery = () => {
  // State
  const [folders, setFolders] = useState<GalleryFolder[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingFolders, setLoadingFolders] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [activeFolder, setActiveFolder] = useState<GalleryFolder | null>(null);

  // Dialogs
  const [isFolderDialogOpen, setIsFolderDialogOpen] = useState(false);
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  
  // Forms
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDesc, setNewFolderDesc] = useState('');
  const [newImageLink, setNewImageLink] = useState({ title: '', image_url: '' });

  // Bulk Upload
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (activeFolder) {
      fetchImages(activeFolder.id);
    } else {
      setImages([]);
    }
  }, [activeFolder]);

  const fetchFolders = async () => {
    try {
      setLoadingFolders(true);
      const { data, error } = await supabase
        .from("gallery_folders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setFolders(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch folders: " + error.message);
    } finally {
      setLoadingFolders(false);
    }
  };

  const fetchImages = async (folderId: string) => {
    try {
      setLoadingImages(true);
      const { data, error } = await supabase
        .from("gallery_images")
        .select("*")
        .eq("folder_id", folderId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setImages(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch gallery images: " + error.message);
    } finally {
      setLoadingImages(false);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newFolderName) return toast.error("Folder Name is required");

      const { data, error } = await supabase
        .from("gallery_folders")
        .insert([{ name: newFolderName, description: newFolderDesc }])
        .select();

      if (error) throw error;

      toast.success("Folder created!");
      setIsFolderDialogOpen(false);
      setNewFolderName('');
      setNewFolderDesc('');
      setFolders([data[0], ...folders]);
    } catch (error: any) {
      toast.error("Failed to create folder: " + error.message);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!confirm("Delete this folder and ALL images inside it? This cannot be undone.")) return;

    try {
      const { error } = await supabase
        .from("gallery_folders")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Folder deleted");
      setFolders(folders.filter(f => f.id !== id));
      if (activeFolder?.id === id) setActiveFolder(null);
    } catch (error: any) {
      toast.error("Failed to delete folder: " + error.message);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFolder) return;

    try {
      if (!newImageLink.image_url) {
        toast.error("Image URL is required");
        return;
      }

      const { data, error } = await supabase
        .from("gallery_images")
        .insert([{ ...newImageLink, folder_id: activeFolder.id }])
        .select();

      if (error) throw error;

      toast.success("Image added from link!");
      setIsLinkDialogOpen(false);
      setNewImageLink({ title: '', image_url: '' });
      setImages([data[0], ...images]);
    } catch (error: any) {
      toast.error("Failed to add image: " + error.message);
    }
  };

  const handleBulkUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!activeFolder || !e.target.files || e.target.files.length === 0) return;
    
    setIsUploading(true);
    const files = Array.from(e.target.files);
    let successCount = 0;
    
    // Process uploads in sequence to avoid overwhelming the server
    for (const file of files) {
      try {
        const fileExt = file.name.split('.').pop() || 'jpg';
        const fileName = `${generateId()}.${fileExt}`;
        const filePath = `${activeFolder.id}/${fileName}`;

        // 1. Upload to Storage — try each bucket candidate
        let uploadedBucket: string | null = null;
        let publicUrl = '';

        for (const bucketName of GALLERY_BUCKET_CANDIDATES) {
          const { error: uploadError } = await supabase.storage
            .from(bucketName)
            .upload(filePath, file);

          if (!uploadError) {
            uploadedBucket = bucketName;
            const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
            publicUrl = data.publicUrl;
            break;
          }

          const msg = uploadError.message?.toLowerCase() || '';
          const isMissingBucket =
            uploadError.name === 'StorageApiError' && msg.includes('bucket not found');

          if (!isMissingBucket) throw uploadError;
        }

        if (!uploadedBucket) {
          throw new Error(
            `Gallery storage bucket not found. Create one in Supabase: ${GALLERY_BUCKET_CANDIDATES.join(', ')}.`
          );
        }

        // 2. Insert Database Record
        const { error: dbError } = await supabase
          .from("gallery_images")
          .insert([{ 
             title: file.name,
             image_url: publicUrl,
             folder_id: activeFolder.id 
          }]);

        if (dbError) throw dbError;
        successCount++;
      } catch (err: any) {
        console.error("Error uploading file:", file.name, err);
        toast.error(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    
    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s)`);
      fetchImages(activeFolder.id); // Refresh images
    }
  };

  const handleDeleteImage = async (id: string, url: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      // 1. Delete DB record
      const { error } = await supabase
        .from("gallery_images")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setImages(images.filter(img => img.id !== id));
      toast.success("Image deleted");

      // 2. Try deleting from storage if it's a Supabase-hosted URL
      const storageMatch = url.match(/\/object\/public\/([^/]+)\/(.+)$/);
      if (storageMatch) {
        const [, bucketName, filePath] = storageMatch;
        // ignore error — not fatal to user intent
        await supabase.storage.from(bucketName).remove([filePath]);
      }

    } catch (error: any) {
      toast.error("Failed to delete image: " + error.message);
    }
  };

  // --- RENDER FUNCTIONS ---

  if (activeFolder) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <Button variant="ghost" className="mb-2 -ml-3 text-muted-foreground" onClick={() => setActiveFolder(null)}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back to Folders
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{activeFolder.name}</h1>
            <p className="text-muted-foreground mt-2">
              {activeFolder.description || "Manage images inside this album."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
             <Button variant="outline" className="gap-2" onClick={() => setIsLinkDialogOpen(true)}>
              <LinkIcon className="w-4 h-4" /> Add Link
            </Button>
            
            <div className="relative">
              <input 
                type="file" 
                multiple 
                accept="image/*"
                onChange={handleBulkUpload}
                ref={fileInputRef}
                className="hidden" 
                id="bulk-upload"
                disabled={isUploading}
              />
              <label htmlFor="bulk-upload">
                <Button className="gap-2 w-full" asChild disabled={isUploading}>
                  <span>
                    <UploadCloud className="w-4 h-4" />
                    {isUploading ? "Uploading..." : "Bulk Upload Files"}
                  </span>
                </Button>
              </label>
            </div>
          </div>
        </div>

        {/* Link Dialog */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Image Link to {activeFolder.name}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLink} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title / Description (Optional)</Label>
                <Input 
                  id="title"
                  placeholder="e.g., Summit Keynote" 
                  value={newImageLink.title}
                  onChange={(e) => setNewImageLink({...newImageLink, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL *</Label>
                <Input 
                  id="image_url"
                  placeholder="https://example.com/image.jpg" 
                  value={newImageLink.image_url}
                  onChange={(e) => setNewImageLink({...newImageLink, image_url: e.target.value})}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Save Image Link</Button>
            </form>
          </DialogContent>
        </Dialog>

        {loadingImages ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
            {[1,2,3,4].map(n => <div key={n} className="bg-muted rounded-xl aspect-square"></div>)}
          </div>
        ) : images.length === 0 ? (
           <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground">No images here yet</h3>
            <p className="text-muted-foreground">Upload files or add links to this album.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative rounded-xl overflow-hidden aspect-square border border-border shadow-sm bg-muted">
                <img 
                  src={image.image_url} 
                  alt={image.title || "Gallery image"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                  <div className="flex justify-end gap-2">
                    <a 
                      href={image.image_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white backdrop-blur-sm transition-colors"
                      title="Open original"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button 
                      onClick={() => handleDeleteImage(image.id, image.image_url)}
                      className="p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full text-white backdrop-blur-sm transition-colors"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {image.title && (
                    <p className="text-white font-medium truncate text-xs bg-black/40 p-1.5 rounded backdrop-blur-sm">
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
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gallery Folders</h1>
          <p className="text-muted-foreground mt-2">
            Organize your photos into albums.
          </p>
        </div>

        <Button className="gap-2" onClick={() => setIsFolderDialogOpen(true)}>
          <FolderPlus className="w-4 h-4" />
          Create Folder
        </Button>

        <Dialog open={isFolderDialogOpen} onOpenChange={setIsFolderDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Folder</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateFolder} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="folder-name">Folder Name *</Label>
                <Input 
                  id="folder-name"
                  placeholder="e.g., Annual Summit 2026" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="folder-desc">Description (Optional)</Label>
                <Input 
                  id="folder-desc"
                  placeholder="Brief description of the event" 
                  value={newFolderDesc}
                  onChange={(e) => setNewFolderDesc(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">Create Folder</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loadingFolders ? (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[1,2,3,4].map(n => <div key={n} className="bg-muted rounded-xl h-32"></div>)}
        </div>
      ) : folders.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No folders found</h3>
          <p className="text-muted-foreground">Create your first folder to start organizing images.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div key={folder.id} className="group relative border border-border bg-card rounded-xl p-5 hover:border-primary/50 transition-colors shadow-sm card-shadow flex flex-col items-center justify-center text-center cursor-pointer min-h-[160px]" onClick={() => setActiveFolder(folder)}>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg px-2 line-clamp-1 w-full">{folder.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1 w-full mt-1 px-2">{folder.description || 'No description'}</p>
              
              <button 
                onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                className="absolute top-3 right-3 p-1.5 opacity-0 group-hover:opacity-100 bg-red-100 hover:bg-red-200 text-red-600 rounded-md transition-all"
                title="Delete Folder"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageGallery;
