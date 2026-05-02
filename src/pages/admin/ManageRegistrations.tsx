import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Download, 
  Trash2, 
  Users, 
  Calendar as CalendarIcon,
  Search,
  FileSpreadsheet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/admin/FormBuilder";

interface Registration {
  id: string;
  data: Record<string, any>;
  submitted_at: string;
}

interface EventDetails {
  title: string;
  date: string | null;
}

const ManageRegistrations = () => {
  const { eventId } = useParams();
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (eventId) {
      fetchEventAndRegistrations();
    }
  }, [eventId]);

  const fetchEventAndRegistrations = async () => {
    try {
      setLoading(true);
      
      // 1. Fetch Event Details
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("title, date")
        .eq("id", eventId)
        .single();
      
      if (eventError) throw eventError;
      setEvent(eventData);

      // 2. Fetch Form Definition
      const { data: formData, error: formError } = await supabase
        .from("event_registration_forms")
        .select("fields")
        .eq("event_id", eventId)
        .maybeSingle();
      
      if (formData) {
        setFields(formData.fields);
      }

      // 3. Fetch Registrations
      const { data: regData, error: regError } = await supabase
        .from("event_registrations")
        .select("*")
        .eq("event_id", eventId)
        .order("submitted_at", { ascending: false });
      
      if (regError) throw regError;
      setRegistrations(regData || []);

    } catch (error: any) {
      toast.error("Failed to fetch registrations: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this registration?")) return;

    try {
      const { error } = await supabase.from("event_registrations").delete().eq("id", id);
      if (error) throw error;
      
      toast.success("Registration deleted");
      setRegistrations(registrations.filter(r => r.id !== id));
    } catch (error: any) {
      toast.error("Delete failed: " + error.message);
    }
  };

  const exportToCSV = () => {
    if (registrations.length === 0) return;

    // Headers
    const headers = ["Submission Date", ...fields.map(f => f.label)];
    
    // Rows
    const rows = registrations.map(reg => {
      return [
        new Date(reg.submitted_at).toLocaleString(),
        ...fields.map(f => {
          const val = reg.data[f.label];
          return typeof val === "boolean" ? (val ? "Yes" : "No") : (val || "");
        })
      ].map(val => `"${String(val).replace(/"/g, '""')}"`).join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `registrations-${event?.title || "event"}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredRegistrations = registrations.filter(reg => {
    const searchStr = JSON.stringify(reg.data).toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-muted-foreground animate-pulse">Loading registrations...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-background p-6 rounded-xl border border-border shadow-sm">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" asChild className="mb-2 -ml-2 text-muted-foreground hover:text-foreground">
            <Link to="/admin/events">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Events
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" />
            Attendees: {event?.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CalendarIcon className="w-4 h-4" />
              {event?.date ? new Date(event.date).toLocaleDateString() : "No date set"}
            </div>
            <Badge variant="secondary">{registrations.length} Total Registrations</Badge>
          </div>
        </div>

        <Button onClick={exportToCSV} disabled={registrations.length === 0} className="gap-2">
          <FileSpreadsheet className="w-4 h-4" />
          Export to CSV
        </Button>
      </div>

      <div className="bg-background rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search attendees..." 
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Showing {filteredRegistrations.length} of {registrations.length} results
          </p>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="w-[180px]">Submission Date</TableHead>
                {fields.map(field => (
                  <TableHead key={field.id}>{field.label}</TableHead>
                ))}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRegistrations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={fields.length + 2} className="h-40 text-center text-muted-foreground">
                    {searchTerm ? "No registrations match your search." : "No registrations yet for this event."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id} className="hover:bg-muted/10 transition-colors">
                    <TableCell className="font-medium">
                      {new Date(reg.submitted_at).toLocaleDateString()}
                      <div className="text-[10px] text-muted-foreground">
                        {new Date(reg.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </TableCell>
                    {fields.map(field => {
                      const value = reg.data[field.label];
                      return (
                        <TableCell key={field.id}>
                          {typeof value === "boolean" ? (
                            <Badge variant={value ? "outline" : "secondary"} className={value ? "bg-green-50 text-green-700 border-green-200" : ""}>
                              {value ? "Yes" : "No"}
                            </Badge>
                          ) : (
                            value || "-"
                          )}
                        </TableCell>
                      );
                    })}
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(reg.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ManageRegistrations;
