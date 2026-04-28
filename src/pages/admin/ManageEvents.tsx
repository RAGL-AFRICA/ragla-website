import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Edit, Plus, Star, Trash2, UploadCloud } from "lucide-react";
import { generateId } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { getEventStatus } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const TIME_SLOTS = Array.from({ length: 48 }, (_, i) => {
  const totalMins = i * 30;
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const ampm = h < 12 ? "AM" : "PM";
  const displayH = h % 12 === 0 ? 12 : h % 12;
  const label = `${String(displayH).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
  return { value, label };
});

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

type EventFormData = {
  title: string;
  description: string;
  date: Date | undefined;
  time: string;
  location: string;
  is_featured: boolean;
};

const initialFormData: EventFormData = {
  title: "",
  description: "",
  date: undefined,
  time: "",
  location: "",
  is_featured: false,
};

const EVENT_BUCKET_CANDIDATES = ["events", "event_flyers", "event-flyers"];

const ManageEvents = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingFlyer, setIsUploadingFlyer] = useState(false);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const toggleDescription = (id: string) => {
    setExpandedEvents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [flyerFile, setFlyerFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string>("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const selectedFlyerPreview = useMemo(() => {
    if (flyerFile) {
      return URL.createObjectURL(flyerFile);
    }
    return existingImageUrl;
  }, [existingImageUrl, flyerFile]);

  useEffect(() => {
    return () => {
      if (flyerFile && selectedFlyerPreview.startsWith("blob:")) {
        URL.revokeObjectURL(selectedFlyerPreview);
      }
    };
  }, [flyerFile, selectedFlyerPreview]);

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
      const eventDate = event.date ? new Date(event.date) : null;
      const derivedTime = eventDate
        ? `${String(eventDate.getHours()).padStart(2, "0")}:${String(eventDate.getMinutes()).padStart(2, "0")}`
        : "";

      setEditingEvent(event);
      setFormData({
        title: event.title,
        description: event.description || "",
        date: eventDate || undefined,
        time: derivedTime,
        location: event.location || "",
        is_featured: event.is_featured,
      });
      setExistingImageUrl(event.image_url || "");
      setFlyerFile(null);
    } else {
      setEditingEvent(null);
      setFormData(initialFormData);
      setExistingImageUrl("");
      setFlyerFile(null);
    }
    setIsDialogOpen(true);
  };

  const uploadEventFlyer = async (file: File) => {
    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${generateId()}.${fileExt}`;

    for (const bucketName of EVENT_BUCKET_CANDIDATES) {
      const filePath = `flyers/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: false });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        return data.publicUrl;
      }

      const message = uploadError.message?.toLowerCase() || "";
      const isMissingBucket = uploadError.name === "StorageApiError" && message.includes("bucket not found");

      if (!isMissingBucket) {
        throw uploadError;
      }
    }

    throw new Error(
      "Event flyer storage bucket not found. Create one bucket in Supabase: events, event_flyers, or event-flyers."
    );
  };

  const buildEventDateIso = () => {
    if (!formData.date) return null;

    const [hours = "00", minutes = "00"] = formData.time.split(":");
    const merged = new Date(formData.date);
    merged.setHours(Number(hours), Number(minutes), 0, 0);
    return merged.toISOString();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl = existingImageUrl || null;

      if (flyerFile) {
        setIsUploadingFlyer(true);
        imageUrl = await uploadEventFlyer(flyerFile);
      }

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || null,
        date: buildEventDateIso(),
        location: formData.location.trim() || null,
        image_url: imageUrl,
        is_featured: formData.is_featured,
      };

      if (editingEvent) {
        const { error } = await supabase.from("events").update(payload).eq("id", editingEvent.id);
        if (error) throw error;
        toast.success("Event updated successfully!");
      } else {
        const { error } = await supabase.from("events").insert([payload]);
        if (error) throw error;
        toast.success("Event created successfully!");
      }

      setIsDialogOpen(false);
      setEditingEvent(null);
      setFormData(initialFormData);
      setFlyerFile(null);
      setExistingImageUrl("");
      fetchEvents();
    } catch (error: any) {
      const message = error.message || "Unknown error";
      toast.error(`Failed to save event: ${message}`);

      if (message.toLowerCase().includes("bucket")) {
        console.error("Event upload failed because storage bucket is missing.", {
          expectedBuckets: EVENT_BUCKET_CANDIDATES,
        });
      }
    } finally {
      setIsSaving(false);
      setIsUploadingFlyer(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const { error } = await supabase.from("events").delete().eq("id", id);

      if (error) throw error;

      toast.success("Event deleted successfully");
      setEvents(events.filter((eventItem) => eventItem.id !== id));
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
            Create and manage events. Upload an event flyer and choose date/time from the picker.
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
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide details about the event..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.date ? format(formData.date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.date}
                        onSelect={(selected) => setFormData({ ...formData, date: selected })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Select
                    value={formData.time}
                    onValueChange={(value) => setFormData({ ...formData, time: value })}
                  >
                    <SelectTrigger id="time">
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {TIME_SLOTS.map(({ value, label }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Accra International Conference Center"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="flyer">Event Flyer (Image Upload)</Label>
                  <Input
                    id="flyer"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFlyerFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Upload an image flyer. This will be shown on the upcoming event section.
                  </p>

                  {selectedFlyerPreview ? (
                    <div className="rounded-lg border overflow-hidden bg-muted/30 max-h-52">
                      <img
                        src={selectedFlyerPreview}
                        alt="Event flyer preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground border rounded-lg p-3 bg-muted/30">
                      <UploadCloud className="w-4 h-4" />
                      No flyer uploaded yet.
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 md:col-span-2 bg-muted/50 p-4 rounded-lg border border-border mt-2">
                  <Switch
                    id="featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                  <Label htmlFor="featured" className="flex items-center gap-2 cursor-pointer">
                    <Star
                      className={`w-4 h-4 ${
                        formData.is_featured ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                      }`}
                    />
                    Mark as Featured Event
                    <span className="text-muted-foreground font-normal text-xs ml-2">
                      (Appears in the highlight section on the homepage)
                    </span>
                  </Label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isUploadingFlyer}>
                  {isSaving || isUploadingFlyer
                    ? "Saving..."
                    : editingEvent
                    ? "Save Changes"
                    : "Create Event"}
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
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No events found</h3>
          <p className="text-muted-foreground">Start by creating your first event.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="flex flex-col md:flex-row bg-background rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
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
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                    {(() => {
                      const status = getEventStatus(event.date);
                      if (status === "Upcoming") return <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-none">Upcoming</Badge>;
                      if (status === "Due") return <Badge className="bg-amber-500 hover:bg-amber-600 text-white border-none">Due</Badge>;
                      if (status === "Past") return <Badge className="bg-gray-500 hover:bg-gray-600 text-white border-none">Past</Badge>;
                    })()}
                  </div>
                  <div className="mb-4">
                    <p className={`text-muted-foreground text-sm break-words ${expandedEvents.has(event.id) ? "" : "line-clamp-3"}`}>
                      {event.description || "No description provided."}
                    </p>
                    {event.description && event.description.length > 160 && (
                      <button
                        type="button"
                        onClick={() => toggleDescription(event.id)}
                        className="text-primary text-xs font-medium mt-1 hover:underline focus:outline-none"
                      >
                        {expandedEvents.has(event.id) ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground font-medium">
                    {event.date && (
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-4 h-4 text-primary" />
                        {new Date(event.date).toLocaleString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary">Location:</span>
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
