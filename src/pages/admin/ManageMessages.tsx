import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Mail, Trash2, CheckCircle, Clock, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

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
  const [replyingTo, setReplyingTo] = useState<ContactMessage | null>(null);
  const [replySubject, setReplySubject] = useState("");
  const [replyBody, setReplyBody] = useState("");
  const [isSendingReply, setIsSendingReply] = useState(false);

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

  const openReplyDialog = (msg: ContactMessage) => {
    setReplyingTo(msg);
    setReplySubject(`Re: ${msg.subject || "Your Inquiry"}`);
    setReplyBody("");
  };

  const handleSendReply = async () => {
    if (!replyingTo) return;
    if (!replyBody.trim()) {
      toast.error("Reply message cannot be empty.");
      return;
    }
    if (!replySubject.trim()) {
      toast.error("Reply subject cannot be empty.");
      return;
    }

    try {
      setIsSendingReply(true);

      const { data: refreshedData, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!sessionData.session?.access_token) throw refreshError;
      }

      const { data: latestSessionData, error: latestSessionError } = await supabase.auth.getSession();
      if (latestSessionError) throw latestSessionError;

      const accessToken = latestSessionData.session?.access_token;
      if (!accessToken) {
        throw new Error("Your admin session has expired. Please sign in again.");
      }

      const { error } = await supabase.functions.invoke("send-reply-email", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: {
          to: replyingTo.email,
          subject: replySubject.trim(),
          reply: replyBody.trim(),
          recipientName: replyingTo.name,
          originalSubject: replyingTo.subject,
          originalMessage: replyingTo.message,
        },
      });

      if (error) throw error;

      // Auto-mark as read after replying
      if (replyingTo.status === "unread") {
        await handleUpdateStatus(replyingTo.id, replyingTo.status);
      }

      setReplyingTo(null);
      setReplyBody("");
      toast.success("Reply sent successfully.");
    } catch (error: any) {
      toast.error("Failed to send reply: " + (error?.message || "Unknown error"));
    } finally {
      setIsSendingReply(false);
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
                      variant="default"
                      onClick={() => openReplyDialog(msg)}
                      title="Reply to this message"
                      className="gap-1.5"
                    >
                      <Reply className="w-4 h-4" />
                      Reply
                    </Button>
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

      {/* Reply Dialog */}
      <Dialog open={!!replyingTo} onOpenChange={(open) => { if (!open) setReplyingTo(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Reply className="w-5 h-5" />
              Reply to {replyingTo?.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <span className="font-medium">To:</span> {replyingTo?.email}
            </div>

            <div className="space-y-2">
              <Label htmlFor="reply-subject">Subject</Label>
              <Input
                id="reply-subject"
                value={replySubject}
                onChange={(e) => setReplySubject(e.target.value)}
              />
            </div>

            {replyingTo?.message && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Original Message</Label>
                <div className="text-xs text-muted-foreground bg-muted/50 rounded-lg p-3 border-l-2 border-primary/40 whitespace-pre-wrap max-h-28 overflow-y-auto">
                  {replyingTo.message}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reply-body">Your Reply *</Label>
              <Textarea
                id="reply-body"
                placeholder="Type your reply here..."
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                rows={6}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-border">
              <Button variant="outline" onClick={() => setReplyingTo(null)} disabled={isSendingReply}>Cancel</Button>
              <Button onClick={handleSendReply} className="gap-2" disabled={isSendingReply}>
                <Reply className="w-4 h-4" />
                {isSendingReply ? "Sending..." : "Send Reply"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageMessages;
