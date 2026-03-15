import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Trash2, Calendar as CalendarIcon, Edit, Plus, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EventType = {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  location: string | null;
  image_url: string | null;
  is_featured: boolean;
  created_at: string;
};

const ManageEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: '',
    is_featured: false
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch events: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (event?: EventType) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || '',
        date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
        location: event.location || '',
        image_url: event.image_url || '',
        is_featured: event.is_featured
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        image_url: '',
        is_featured: false
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.title) {
        toast.error("Title is required");
        return;
      }

      const payload = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null
      };

      if (editingEvent) {
        const { error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingEvent.id);
        
        if (error) throw error;
        toast.success("Event updated successfully!");
      } else {
        const { error } = await supabase
          .from("events")
          .insert([payload]);
          
        if (error) throw error;
        toast.success("Event created successfully!");
      }

      setIsDialogOpen(false);
      fetchEvents();
    } catch (error: any) {
      toast.error(`Failed to save event: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Event deleted successfully");
      setEvents(events.filter(e => e.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete event: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-background p-6 rounded-xl border border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage events. Mark an event as "Featured" to show it on the homepage.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input 
                    id="title"
                    placeholder="e.g., Annual Leadership Summit" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description"
                    placeholder="Provide details about the event..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date & Time</Label>
                  <Input 
                    id="date"
                    type="datetime-local"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location"
                    placeholder="e.g., Accra International Conference Center" 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input 
                    id="image_url"
                    placeholder="https://example.com/event-banner.jpg" 
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>

                <div className="flex items-center space-x-2 md:col-span-2 bg-muted/50 p-4 rounded-lg border border-border mt-2">
                  <Switch 
                    id="featured" 
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                  />
                  <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                    <Star className={`w-4 h-4 ${formData.is_featured ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                    Mark as Featured Event
                    <span className="text-muted-foreground font-normal text-xs ml-2">
                      (Appears highlight section on the homepage)
                    </span>
                  </Label>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingEvent ? "Save Changes" : "Create Event"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(n => <div key={n} className="bg-muted h-32 rounded-xl"></div>)}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No events found</h3>
          <p className="text-muted-foreground">Start by creating your first event.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col md:flex-row bg-background rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Event Image */}
              <div className="w-full md:w-48 h-48 md:h-auto shrink-0 bg-muted relative">
                {event.image_url ? (
                  <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <CalendarIcon className="w-8 h-8 opacity-20" />
                  </div>
                )}
                {event.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> Featured
                  </div>
                )}
              </div>

              {/* Event Content */}
              <div className="flex-1 p-5 lg:p-6 flex flex-col justify-center relative">
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button size="icon" variant="secondary" onClick={() => handleOpenDialog(event)} title="Edit event">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(event.id)} title="Delete event">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="pr-20">
                  <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                    {event.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                    {event.date && (
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' 
                        })}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary">📍</span>
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageEvents;
