import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Trash2, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string | null;
  status: string;
  created_at: string;
};

const ManageMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast.error("Failed to fetch messages: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'unread' ? 'read' : 'unread';
    try {
      const { error } = await supabase
        .from("contact_messages")
        .update({ status: newStatus })
        .eq("id", id);
        
      if (error) throw error;
      
      setMessages(messages.map(msg => msg.id === id ? { ...msg, status: newStatus } : msg));
      toast.success(`Message marked as ${newStatus}`);
    } catch (error: any) {
      toast.error("Failed to update status: " + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      const { error } = await supabase
        .from("contact_messages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      toast.success("Message deleted successfully");
      setMessages(messages.filter(msg => msg.id !== id));
    } catch (error: any) {
      toast.error("Failed to delete message: " + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Messages</h1>
          <p className="text-muted-foreground mt-2">
            View inquiries submitted through the Contact Us form.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {[1,2,3].map(n => <div key={n} className="bg-muted h-32 rounded-xl"></div>)}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 bg-background rounded-xl border border-dashed border-border">
          <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium text-foreground">No messages found</h3>
          <p className="text-muted-foreground">You haven't received any inquiries yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-6 rounded-xl border transition-colors relative ${
                msg.status === 'unread' ? 'bg-primary/5 border-primary/20 shadow-sm' : 'bg-background border-border'
              }`}
            >
              <div className="flex justify-between items-start gap-4 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">{msg.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      msg.status === 'unread' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {msg.status.toUpperCase()}
                    </span>
                  </div>
                  <a href={`mailto:${msg.email}`} className="text-primary hover:underline text-sm font-medium inline-block mb-2">
                    {msg.email}
                  </a>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mt-1 mb-2">
                    {msg.subject || 'No Subject'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(msg.created_at).toLocaleDateString()}
                  </span>
                  
                  <div className="flex gap-2 ml-4">
                    <Button 
                      size="sm" 
                      variant={msg.status === 'unread' ? 'outline' : 'secondary'} 
                      onClick={() => handleUpdateStatus(msg.id, msg.status)}
                      title={msg.status === 'unread' ? "Mark as Read" : "Mark as Unread"}
                    >
                      <CheckCircle className={`w-4 h-4 ${msg.status === 'unread' ? 'opacity-50' : 'text-primary'}`} />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(msg.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {msg.message && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageMessages;
