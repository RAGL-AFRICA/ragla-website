import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Edit, Plus, Trash2, Newspaper, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type NewsPostType = {
  id: string;
  title: string;
  content: string | null;
  category: "news" | "post";
  image_url: string | null;
  published_at: string | null;
  created_at: string;
};

type FormDataType = {
  title: string;
  content: string;
  category: "news" | "post";
  image_url: string;
  published_at: string;
};

const initialFormData: FormDataType = {
  title: "",
  content: "",
  category: "news",
  image_url: "",
  published_at: "",
};

const ManageNewsPosts = () => {
  const [items, setItems] = useState<NewsPostType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NewsPostType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<FormDataType>(initialFormData);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("news_posts")
        .select("*")
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error("Failed to load posts/news: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (item?: NewsPostType) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        title: item.title,
        content: item.content || "",
        category: item.category,
        image_url: item.image_url || "",
        published_at: item.published_at ? new Date(item.published_at).toISOString().slice(0, 16) : "",
      });
    } else {
      setEditingItem(null);
      setFormData(initialFormData);
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        title: formData.title.trim(),
        content: formData.content.trim() || null,
        category: formData.category,
        image_url: formData.image_url.trim() || null,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : null,
      };

      if (editingItem) {
        const { error } = await supabase.from("news_posts").update(payload).eq("id", editingItem.id);
        if (error) throw error;
        toast.success("Updated successfully");
      } else {
        const { error } = await supabase.from("news_posts").insert([payload]);
        if (error) throw error;
        toast.success("Created successfully");
      }

      setIsDialogOpen(false);
      setEditingItem(null);
      setFormData(initialFormData);
      fetchItems();
    } catch (error: any) {
      toast.error("Failed to save item: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;

    try {
      const { error } = await supabase.from("news_posts").delete().eq("id", id);
      if (error) throw error;

      toast.success("Deleted successfully");
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete item: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-background p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage News & Posts</h1>
          <p className="text-muted-foreground mt-1">Create, update and delete news/posts shown on the website.</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              New Item
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingItem ? "Edit Item" : "Create Item"}</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.category} onValueChange={(value: "news" | "post") => setFormData({ ...formData, category: value })}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="news">News</SelectItem>
                    <SelectItem value="post">Post</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write the post/news content"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL (optional)</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="published_at">Publish Date/Time (optional)</Label>
                <Input
                  id="published_at"
                  type="datetime-local"
                  value={formData.published_at}
                  onChange={(e) => setFormData({ ...formData, published_at: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? "Saving..." : editingItem ? "Save Changes" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-muted h-32 rounded-xl"></div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <Newspaper className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No items found</h3>
          <p className="text-muted-foreground">Create your first news/post item.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item.id} className="bg-background rounded-xl border border-border p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {item.category === "news" ? (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        <Newspaper className="w-3.5 h-3.5" /> News
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <FileText className="w-3.5 h-3.5" /> Post
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-foreground break-words">{item.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(item.published_at || item.created_at).toLocaleString("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                  {item.content && <p className="text-sm text-foreground mt-3 whitespace-pre-wrap">{item.content}</p>}
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button size="icon" variant="secondary" title="Edit" onClick={() => handleOpenDialog(item)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" title="Delete" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageNewsPosts;
